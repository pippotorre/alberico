<?php
// Risposte dell'API JSON. Solo lettura: nessun dato personale.

final class Api
{
    public const MAX_GIORNI = 62;

    /** Fasce con le loro diete, nell'ordine in cui si mostrano. */
    public static function elencoMenu(PDO $pdo): array
    {
        $righe = $pdo->query(
            'SELECT m.id, m.fascia_id, f.nome AS fascia, f.gruppo, f.colore, m.dieta_id, d.nome AS dieta, m.calendar_id, m.ultimo_import
               FROM menu m
               JOIN fasce f ON f.id = m.fascia_id
               JOIN diete d ON d.id = m.dieta_id
              WHERE m.attivo = 1
              ORDER BY f.ordine, d.ordine'
        )->fetchAll();

        $fasce = [];
        foreach ($righe as $r) {
            $fasce[$r['fascia_id']] ??= [
                'id' => $r['fascia_id'],
                'nome' => $r['fascia'],
                'gruppo' => $r['gruppo'],
                'colore' => $r['colore'],
                'diete' => [],
            ];
            $fasce[$r['fascia_id']]['diete'][] = [
                'menu' => (int) $r['id'],
                'id' => $r['dieta_id'],
                'nome' => $r['dieta'],
                'calendario' => Calendari::urlUfficiale($r['calendar_id']),
            ];
        }
        return ['fasce' => array_values($fasce)];
    }

    /** Menu di un intervallo di date (predefinito: da oggi per 14 giorni). */
    public static function giorni(PDO $pdo, int $menuId, ?string $da, ?string $a, string $fuso): array
    {
        $oggi = new DateTimeImmutable('today', new DateTimeZone($fuso));
        $inizio = self::data($da) ?? $oggi;
        $fine = self::data($a) ?? $inizio->modify('+13 days');
        if ($fine < $inizio) {
            return [400, ['errore' => 'La data finale è prima di quella iniziale']];
        }
        if ($inizio->diff($fine)->days >= self::MAX_GIORNI) {
            return [400, ['errore' => 'Intervallo troppo lungo (massimo ' . self::MAX_GIORNI . ' giorni)']];
        }

        $m = $pdo->prepare(
            'SELECT m.id, f.nome AS fascia, f.colore, d.nome AS dieta, m.calendar_id, m.ultimo_import
               FROM menu m JOIN fasce f ON f.id = m.fascia_id JOIN diete d ON d.id = m.dieta_id
              WHERE m.id = ? AND m.attivo = 1'
        );
        $m->execute([$menuId]);
        $menu = $m->fetch();
        if (!$menu) {
            return [404, ['errore' => 'Menu non trovato']];
        }

        $g = $pdo->prepare('SELECT data, piatti FROM giorni WHERE menu_id = ? AND data BETWEEN ? AND ? ORDER BY data');
        $g->execute([$menuId, $inizio->format('Y-m-d'), $fine->format('Y-m-d')]);
        $giorni = array_map(fn($r) => [
            'data' => $r['data'],
            'piatti' => json_decode($r['piatti'], true),
        ], $g->fetchAll());

        // Prima data pubblicata dopo l'intervallo: serve a dire "il menu riprende il…".
        $p = $pdo->prepare('SELECT MIN(data) FROM giorni WHERE menu_id = ? AND data > ?');
        $p->execute([$menuId, $fine->format('Y-m-d')]);

        return [200, [
            'menu' => [
                'id' => (int) $menu['id'],
                'fascia' => $menu['fascia'],
                'dieta' => $menu['dieta'],
                'colore' => $menu['colore'],
                'calendario' => Calendari::urlUfficiale($menu['calendar_id']),
                'aggiornato' => $menu['ultimo_import'],
            ],
            'da' => $inizio->format('Y-m-d'),
            'a' => $fine->format('Y-m-d'),
            'giorni' => $giorni,
            'prossimo' => $p->fetchColumn() ?: null,
        ]];
    }

    /**
     * Avvia l'importazione dei calendari. La chiama ogni mattina GitHub Actions con
     * "Authorization: Bearer <token>"; il token sta in src/config.php e nei secrets di GitHub.
     */
    public static function importa(?string $intestazione, ?string $tokenAtteso, callable $importaTutti): array
    {
        if ($tokenAtteso === null || strlen($tokenAtteso) < 32) {
            return [503, ['errore' => 'Importazione non configurata']];
        }
        $token = preg_match('/^Bearer\s+(\S+)$/', (string) $intestazione, $m) ? $m[1] : '';
        if (!hash_equals($tokenAtteso, $token)) {
            return [401, ['errore' => 'Non autorizzato']];
        }
        $esiti = $importaTutti();
        $errori = array_values(array_filter($esiti, fn($e) => $e['errore'] !== null));
        return [count($errori) === count($esiti) ? 502 : 200, [
            'menu' => count($esiti),
            'importati' => count($esiti) - count($errori),
            'giorni' => array_sum(array_column($esiti, 'giorni')),
            'errori' => $errori,
        ]];
    }

    private static function data(?string $s): ?DateTimeImmutable
    {
        if ($s === null || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $s)) {
            return null;
        }
        $d = DateTimeImmutable::createFromFormat('!Y-m-d', $s);
        return $d && $d->format('Y-m-d') === $s ? $d : null;
    }
}
