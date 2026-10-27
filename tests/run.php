<?php
// Prove automatiche su SQLite in memoria, senza rete. Uso: php tests/run.php

require __DIR__ . '/../src/bootstrap.php';

$falliti = 0;
function verifica(string $nome, bool $ok, mixed $dettaglio = null): void
{
    global $falliti;
    echo ($ok ? 'ok   ' : 'NO   ') . $nome . "\n";
    if (!$ok) {
        $falliti++;
        if ($dettaglio !== null) {
            echo '     ' . json_encode($dettaglio, JSON_UNESCAPED_UNICODE) . "\n";
        }
    }
}

function nuovoDb(): PDO
{
    $pdo = new PDO('sqlite::memory:', null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec(file_get_contents(__DIR__ . '/schema_sqlite.sql'));
    return $pdo;
}

$ics = file_get_contents(__DIR__ . '/fixtures/primaria-ordinario.ics');

// --- IcsParser ---
$giorni = IcsParser::giorni($ics);
verifica('parser: 4 giorni (l\'evento annullato è escluso)', array_keys($giorni) === ['2026-09-01', '2026-09-02', '2026-09-04', '2026-10-16'], array_keys($giorni));
verifica('parser: righe spezzate e virgole', $giorni['2026-09-02']['testo'] === 'RAVIOLI DI MAGRO BURRO E SALVIA, FAGIOLI IN INSALATA, INSALATA DI POMODORI E OLIVE, PANE, BANANA (equosolidale)', $giorni['2026-09-02']['testo']);
verifica('parser: data-ora UTC portata al fuso di Roma', isset($giorni['2026-10-16']));

// --- Piatti ---
$p = Piatti::daTesto($giorni['2026-09-01']['testo']);
verifica('piatti: punto nel mezzo e maiuscole', $p === ['Pasta alle zucchine', 'Polpette di bovino in umido', 'Purea di patate', 'Pane', 'Melone/anguria'], $p);
$p = Piatti::daTesto('BRODO VEGETALE CON PASTINA, UOVO  SODO, , PANE, BANANA (equosolidale)');
verifica('piatti: spazi doppi e voci vuote', $p === ['Brodo vegetale con pastina', 'Uovo sodo', 'Pane', 'Banana (equosolidale)'], $p);
$p = Piatti::daTesto('FILETTO DI PLATESSA, COSTINE SALTATE ALL’OLIO');
verifica('piatti: apostrofo tipografico', $p[1] === 'Costine saltate all’olio', $p);

// --- Importer ---
$pdo = nuovoDb();
$scaricati = [];
$importer = new Importer($pdo, function (string $url) use ($ics, &$scaricati): string {
    $scaricati[] = $url;
    if (str_contains($url, 'hqmct17n9uhpn10l9k9hoc08lo')) {
        return $ics;
    }
    if (str_contains($url, 'alhf1h0c8rtq7oeq0bq6i9jff8')) {
        throw new RuntimeException('download fallito (HTTP 404)');
    }
    return "BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n";
});
$esiti = $importer->importaTutti();
$numMenu = array_sum(array_map('count', Calendari::CALENDARI));
verifica('importer: un download per ogni menu', count($scaricati) === $numMenu && $numMenu === 40, count($scaricati));
verifica('importer: URL del feed pubblico', in_array('https://calendar.google.com/calendar/ical/hqmct17n9uhpn10l9k9hoc08lo%40group.calendar.google.com/public/basic.ics', $scaricati, true));
$primaria = $pdo->query("SELECT id FROM buonapp_menu WHERE fascia_id = 'primaria' AND dieta_id = 'ordinario'")->fetchColumn();
verifica('importer: 4 giorni salvati per la primaria', (int) $pdo->query("SELECT COUNT(*) FROM buonapp_giorni WHERE menu_id = $primaria")->fetchColumn() === 4);
$err = $pdo->query("SELECT ultimo_errore FROM buonapp_menu WHERE calendar_id = 'alhf1h0c8rtq7oeq0bq6i9jff8'")->fetchColumn();
verifica('importer: errore di download registrato', str_contains((string) $err, '404'), $err);

// Un secondo giro con il feed vuoto non deve cancellare i giorni già salvati.
$vuoto = new Importer($pdo, fn() => "BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n");
$vuoto->importa((int) $primaria, 'hqmct17n9uhpn10l9k9hoc08lo');
verifica('importer: feed vuoto non cancella nulla', (int) $pdo->query("SELECT COUNT(*) FROM buonapp_giorni WHERE menu_id = $primaria")->fetchColumn() === 4);

// Una correzione del Comune sostituisce il giorno.
$corretto = str_replace('PASTA ALLE ZUCCHINE', 'PASTA AL POMODORO', $ics);
(new Importer($pdo, fn() => $corretto))->importa((int) $primaria, 'hqmct17n9uhpn10l9k9hoc08lo');
$piatti = json_decode($pdo->query("SELECT piatti FROM buonapp_giorni WHERE menu_id = $primaria AND data = '2026-09-01'")->fetchColumn(), true);
verifica('importer: la correzione sostituisce il piatto', $piatti[0] === 'Pasta al pomodoro', $piatti);

// Reimportare l'elenco non duplica i menu.
$importer->sincronizzaElenco();
verifica('importer: elenco senza duplicati', (int) $pdo->query('SELECT COUNT(*) FROM buonapp_menu')->fetchColumn() === 40);

$tabelle = $pdo->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name <> 'sqlite_sequence'")->fetchAll(PDO::FETCH_COLUMN);
verifica('schema: tutte le tabelle hanno il prefisso buonapp_', $tabelle !== [] && array_filter($tabelle, fn($t) => !str_starts_with($t, 'buonapp_')) === [], $tabelle);

// --- Api ---
$elenco = Api::elencoMenu($pdo)['fasce'];
verifica('api: 6 fasce in ordine di età', array_column($elenco, 'id') === array_keys(Calendari::FASCE), array_column($elenco, 'id'));
verifica('api: la primaria ha 7 diete, il nido 6–9 ne ha 6', count($elenco[4]['diete']) === 7 && count($elenco[0]['diete']) === 6);

[$codice, $r] = Api::giorni($pdo, (int) $primaria, '2026-09-01', '2026-09-07', 'Europe/Rome');
verifica('api: giorni di una settimana', $codice === 200 && array_column($r['giorni'], 'data') === ['2026-09-01', '2026-09-02', '2026-09-04'], $r);
verifica('api: prossimo giorno pubblicato dopo l\'intervallo', $r['prossimo'] === '2026-10-16', $r['prossimo']);

[$codice, $r] = Api::giorni($pdo, (int) $primaria, '2026-10-17', '2026-10-30', 'Europe/Rome');
verifica('api: periodo senza menu pubblicato', $codice === 200 && $r['giorni'] === [] && $r['prossimo'] === null, $r);

[$codice] = Api::giorni($pdo, (int) $primaria, '2026-09-10', '2026-09-01', 'Europe/Rome');
verifica('api: date invertite → 400', $codice === 400);
[$codice] = Api::giorni($pdo, (int) $primaria, '2026-01-01', '2026-12-31', 'Europe/Rome');
verifica('api: intervallo troppo lungo → 400', $codice === 400);
[$codice] = Api::giorni($pdo, 9999, null, null, 'Europe/Rome');
verifica('api: menu inesistente → 404', $codice === 404);
[$codice, $r] = Api::giorni($pdo, (int) $primaria, '2026-02-30', null, 'Europe/Rome');
verifica('api: data non valida → si usa oggi', $codice === 200 && $r['da'] === (new DateTime('today', new DateTimeZone('Europe/Rome')))->format('Y-m-d'), $r['da']);

// --- Importazione via API ---
$token = str_repeat('a1', 20);
$chiamate = 0;
$finto = function () use (&$chiamate) {
    $chiamate++;
    return [['menu' => 'a', 'giorni' => 10, 'errore' => null], ['menu' => 'b', 'giorni' => 0, 'errore' => 'download fallito']];
};
[$codice] = Api::importa('Bearer ' . $token, null, $finto);
verifica('importa: senza token configurato → 503', $codice === 503 && $chiamate === 0);
[$codice] = Api::importa('Bearer corto', 'corto', $finto);
verifica('importa: token configurato troppo corto → 503', $codice === 503 && $chiamate === 0);
[$codice] = Api::importa(null, $token, $finto);
verifica('importa: senza intestazione → 401', $codice === 401 && $chiamate === 0);
[$codice] = Api::importa('Bearer sbagliato', $token, $finto);
verifica('importa: token sbagliato → 401', $codice === 401 && $chiamate === 0);
[$codice, $r] = Api::importa('Bearer ' . $token, $token, $finto);
verifica('importa: token giusto → 200 con riepilogo', $codice === 200 && $chiamate === 1 && $r['importati'] === 1 && count($r['errori']) === 1, $r);
[$codice] = Api::importa('Bearer ' . $token, $token, fn() => [['menu' => 'a', 'giorni' => 0, 'errore' => 'x']]);
verifica('importa: tutti i calendari falliti → 502', $codice === 502);

// --- Link al calendario ufficiale ---
verifica('api: link al calendario ufficiale', $elenco[4]['diete'][0]['calendario'] === 'https://calendar.google.com/calendar/embed?src=hqmct17n9uhpn10l9k9hoc08lo%40group.calendar.google.com&ctz=Europe%2FRome', $elenco[4]['diete'][0]['calendario']);

echo $falliti === 0 ? "\nTutte le prove sono passate.\n" : "\n$falliti prove fallite.\n";
exit($falliti === 0 ? 0 : 1);
