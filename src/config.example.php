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
];
