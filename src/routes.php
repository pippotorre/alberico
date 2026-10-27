<?php
// Rotte dell'API: metodo + espressione regolare sul percorso dopo /api/v1 → funzione.
// Ogni funzione riceve i gruppi catturati e restituisce [codice HTTP, dati].

return [
    ['GET', '#^/menu$#', function () {
        $pdo = ConfigLoader::pdo();
        $elenco = Api::elencoMenu($pdo);
        if ($elenco['fasce'] === []) {
            // Primo avvio: l'elenco dei menu non richiede rete, i piatti arrivano con l'aggiornamento.
            (new Importer($pdo, null, ConfigLoader::fuso()))->sincronizzaElenco();
            $elenco = Api::elencoMenu($pdo);
        }
        return [200, $elenco];
    }],
    ['GET', '#^/menu/(\d+)/giorni$#', fn(string $id) => Api::giorni(
        ConfigLoader::pdo(),
        (int) $id,
        $_GET['da'] ?? null,
        $_GET['a'] ?? null,
        ConfigLoader::fuso()
    )],
    ['POST', '#^/aggiorna$#', function () {
        ignore_user_abort(true);
        set_time_limit(300);
        return Api::aggiorna(
            ConfigLoader::pdo(),
            new DateTimeImmutable('now', new DateTimeZone(ConfigLoader::fuso())),
            fn() => (new Importer(ConfigLoader::pdo(), null, ConfigLoader::fuso()))->importaTutti()
        );
    }],
    ['GET', '#^/stato$#', fn() => [200, Api::stato(ConfigLoader::pdo())]],
    // Importazione forzata con token (es. con curl), indipendente dal limite di ore.
    ['POST', '#^/importa$#', function () {
        set_time_limit(300);
        return Api::importa(
            $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null,
            ConfigLoader::get()['token_importazione'] ?? null,
            fn() => (new Importer(ConfigLoader::pdo(), null, ConfigLoader::fuso()))->importaTutti()
        );
    }],
];
