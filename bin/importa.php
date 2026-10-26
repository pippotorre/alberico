<?php
// Importa i menu dai calendari del Comune.
// Uso: php bin/importa.php    (da lanciare una volta al giorno, es. con cron)

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/../src/bootstrap.php';

$importer = new Importer(ConfigLoader::pdo(), null, ConfigLoader::fuso());
$errori = 0;
foreach ($importer->importaTutti() as $esito) {
    if ($esito['errore'] !== null) {
        $errori++;
        fwrite(STDERR, sprintf("%-40s ERRORE: %s\n", $esito['menu'], $esito['errore']));
    } else {
        printf("%-40s %d giorni\n", $esito['menu'], $esito['giorni']);
    }
}
exit($errori > 0 ? 1 : 0);
