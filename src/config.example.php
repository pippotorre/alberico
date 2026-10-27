<?php
// Modello di src/config.php: si compila con i dati veri e si carica a mano su Tophost
// in buonapp/src/config.php. Non va mai nel repository (è in .gitignore) e non è nello ZIP,
// così caricare una nuova versione del sito non lo sovrascrive.

return [
    'db' => [
        // Host e nome del database si trovano nel pannello Tophost, sezione Database MySQL.
        'dsn'      => 'mysql:host=HOST_DATABASE;dbname=NOME_DATABASE;charset=utf8mb4',
        'utente'   => 'UTENTE',
        'password' => 'PASSWORD',
    ],
    'fuso' => 'Europe/Rome',
    // Facoltativo: serve solo per forzare l'importazione con POST /api/v1/importa
    // (almeno 32 caratteri casuali, es. generato con: php -r 'echo bin2hex(random_bytes(32));').
    'token_importazione' => '',
];
