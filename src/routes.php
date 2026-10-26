<?php
// Rotte dell'API: metodo + espressione regolare sul percorso dopo /api/v1 → funzione.
// Ogni funzione riceve i gruppi catturati e restituisce [codice HTTP, dati].

return [
    ['GET', '#^/menu$#', fn() => [200, Api::elencoMenu(ConfigLoader::pdo())]],
    ['GET', '#^/menu/(\d+)/giorni$#', fn(string $id) => Api::giorni(
        ConfigLoader::pdo(),
        (int) $id,
        $_GET['da'] ?? null,
        $_GET['a'] ?? null,
        ConfigLoader::fuso()
    )],
];
