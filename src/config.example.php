<?php
// Copiare in src/config.php sul server e inserire i dati veri.
// src/config.php non va mai nel repository (è in .gitignore) e il deploy non lo carica.

return [
    'db' => [
        'dsn'      => 'mysql:host=localhost;dbname=NOME_DATABASE;charset=utf8mb4',
        'utente'   => 'UTENTE',
        'password' => 'PASSWORD',
    ],
    'fuso' => 'Europe/Rome',
    // Stesso valore del secret IMPORT_TOKEN su GitHub (almeno 32 caratteri casuali,
    // es. generato con: php -r 'echo bin2hex(random_bytes(32));').
    'token_importazione' => '',
];
