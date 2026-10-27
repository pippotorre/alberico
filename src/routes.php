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
    ['POST', '#^/importa$#', function () {
        set_time_limit(300);
        return Api::importa(
            $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null,
            ConfigLoader::get()['token_importazione'] ?? null,
            fn() => (new Importer(ConfigLoader::pdo(), null, ConfigLoader::fuso()))->importaTutti()
        );
    }],
];
