<?php
// Unico punto d'ingresso dell'API: /api/v1/... arriva qui grazie a api/.htaccess.

require __DIR__ . '/../src/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$percorso = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$percorso = preg_replace('#^.*?/api/v1#', '', $percorso);
$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

[$codice, $dati] = [404, ['errore' => 'Risorsa non trovata']];
try {
    foreach (require __DIR__ . '/../src/routes.php' as [$m, $regex, $azione]) {
        if (preg_match($regex, $percorso, $gruppi)) {
            if ($m !== $metodo) {
                [$codice, $dati] = [405, ['errore' => 'Metodo non consentito']];
                continue;
            }
            [$codice, $dati] = $azione(...array_slice($gruppi, 1));
            break;
        }
    }
} catch (Throwable $e) {
    error_log('buonApp API: ' . $e->getMessage());
    [$codice, $dati] = [500, ['errore' => 'Errore interno']];
}

// Nessuna cache nel browser: dopo un'importazione i menu nuovi devono vedersi subito
// (una risposta vuota tenuta in cache nascondeva tutti i menu). L'app offline usa il service worker.
header('Cache-Control: no-store');
http_response_code($codice);
if ($dati !== null) {
    echo json_encode($dati, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
