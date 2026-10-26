<?php
// Carica le classi di src/ (una classe per file, stesso nome del file).

spl_autoload_register(function (string $classe): void {
    $file = __DIR__ . '/' . $classe . '.php';
    if (is_file($file)) {
        require $file;
    }
});
