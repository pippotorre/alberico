<?php
// Scarica i calendari del Comune e aggiorna il database.
// Per ogni menu il contenuto del feed sostituisce quello salvato: se il Comune corregge un piatto,
// la correzione arriva al giro successivo. Un feed vuoto o non scaricabile non cancella nulla.

final class Importer
{
    /** @var callable(string): string */
    private $scarica;

    public function __construct(private PDO $pdo, ?callable $scarica = null, private string $fuso = 'Europe/Rome')
    {
        $this->scarica = $scarica ?? [self::class, 'scaricaHttp'];
    }

    /** Allinea fasce, diete e menu del database all'elenco in Calendari. */
    public function sincronizzaElenco(): void
    {
        $this->pdo->beginTransaction();
        $ordine = 0;
        foreach (Calendari::FASCE as $id => $f) {
            $this->salva('fasce', $id, ['nome' => $f['nome'], 'gruppo' => $f['gruppo'], 'colore' => $f['colore'], 'ordine' => $ordine++]);
        }
        $ordine = 0;
        foreach (Calendari::DIETE as $id => $nome) {
            $this->salva('diete', $id, ['nome' => $nome, 'ordine' => $ordine++]);
        }

        $this->pdo->exec('UPDATE menu SET attivo = 0');
        $trova = $this->pdo->prepare('SELECT id FROM menu WHERE fascia_id = ? AND dieta_id = ?');
        $aggiorna = $this->pdo->prepare('UPDATE menu SET calendar_id = ?, attivo = 1 WHERE id = ?');
        $inserisci = $this->pdo->prepare('INSERT INTO menu (fascia_id, dieta_id, calendar_id, attivo) VALUES (?, ?, ?, 1)');
        foreach (Calendari::CALENDARI as $fascia => $diete) {
            foreach ($diete as $dieta => $calendarId) {
                $trova->execute([$fascia, $dieta]);
                $id = $trova->fetchColumn();
                if ($id !== false) {
                    $aggiorna->execute([$calendarId, $id]);
                } else {
                    $inserisci->execute([$fascia, $dieta, $calendarId]);
                }
            }
        }
        $this->pdo->commit();
    }

    /** @return list<array{menu: string, giorni: int, errore: ?string}> */
    public function importaTutti(): array
    {
        $this->sincronizzaElenco();
        $esiti = [];
        $menu = $this->pdo->query('SELECT id, fascia_id, dieta_id, calendar_id FROM menu WHERE attivo = 1 ORDER BY id')->fetchAll();
        foreach ($menu as $m) {
            $esiti[] = ['menu' => "$m[fascia_id]/$m[dieta_id]"] + $this->importa((int) $m['id'], $m['calendar_id']);
        }
        return $esiti;
    }

    /** @return array{giorni: int, errore: ?string} */
    public function importa(int $menuId, string $calendarId): array
    {
        try {
            $ics = ($this->scarica)(Calendari::urlFeed($calendarId));
            if (!str_contains($ics, 'BEGIN:VCALENDAR')) {
                throw new RuntimeException('risposta non è un calendario iCal');
            }
            $giorni = IcsParser::giorni($ics, $this->fuso);
            if ($giorni === []) {
                throw new RuntimeException('calendario senza eventi');
            }
        } catch (Throwable $e) {
            $this->pdo->prepare('UPDATE menu SET ultimo_errore = ? WHERE id = ?')
                ->execute([mb_substr($e->getMessage(), 0, 255), $menuId]);
            return ['giorni' => 0, 'errore' => $e->getMessage()];
        }

        $this->pdo->beginTransaction();
        $this->pdo->prepare('DELETE FROM giorni WHERE menu_id = ?')->execute([$menuId]);
        $ins = $this->pdo->prepare('INSERT INTO giorni (menu_id, data, piatti, testo) VALUES (?, ?, ?, ?)');
        foreach ($giorni as $data => $g) {
            $piatti = json_encode(Piatti::daTesto($g['testo']), JSON_UNESCAPED_UNICODE);
            $ins->execute([$menuId, $data, $piatti, $g['testo']]);
        }
        $this->pdo->prepare('UPDATE menu SET ultimo_import = ?, ultimo_errore = NULL WHERE id = ?')
            ->execute([(new DateTime('now', new DateTimeZone($this->fuso)))->format('Y-m-d H:i:s'), $menuId]);
        $this->pdo->commit();
        return ['giorni' => count($giorni), 'errore' => null];
    }

    private function salva(string $tabella, string $id, array $campi): void
    {
        $c = $this->pdo->prepare("SELECT COUNT(*) FROM $tabella WHERE id = ?");
        $c->execute([$id]);
        $nomi = array_keys($campi);
        if ((int) $c->fetchColumn() > 0) {
            $set = implode(', ', array_map(fn($n) => "$n = ?", $nomi));
            $this->pdo->prepare("UPDATE $tabella SET $set WHERE id = ?")->execute([...array_values($campi), $id]);
        } else {
            $col = implode(', ', ['id', ...$nomi]);
            $seg = implode(', ', array_fill(0, count($nomi) + 1, '?'));
            $this->pdo->prepare("INSERT INTO $tabella ($col) VALUES ($seg)")->execute([$id, ...array_values($campi)]);
        }
    }

    public static function scaricaHttp(string $url): string
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_USERAGENT => 'buonApp/1.0 (+menu ristorazione scolastica Torino)',
        ]);
        $corpo = curl_exec($ch);
        $codice = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $errore = curl_error($ch);
        curl_close($ch);
        if ($corpo === false || $codice !== 200) {
            throw new RuntimeException("download fallito (HTTP $codice) $errore");
        }
        return $corpo;
    }
}
