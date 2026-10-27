<?php
// Elenco dei menu del Comune di Torino: fascia scolastica + dieta → Google Calendar pubblico.
// Fonte: https://www.comune.torino.it/schede-informative/ristorazione-scolastica-menu (letta il 26/10/2026).
// Se il Comune cambia un calendario, si aggiorna solo questo file: l'importatore riallinea il database.

final class Calendari
{
    public const SUFFISSO = '@group.calendar.google.com';

    /** Fasce in ordine di età; il colore viene dalla grafica originale di buonApp. */
    public const FASCE = [
        'nido-6-9'   => ['nome' => 'Nido 6–9 mesi',     'gruppo' => 'Nidi d’infanzia',   'colore' => 'rosso'],
        'nido-9-12'  => ['nome' => 'Nido 9–12 mesi',    'gruppo' => 'Nidi d’infanzia',   'colore' => 'rosso'],
        'nido-12-36' => ['nome' => 'Nido 12–36 mesi',   'gruppo' => 'Nidi d’infanzia',   'colore' => 'rosso'],
        'infanzia'   => ['nome' => 'Scuola dell’infanzia', 'gruppo' => 'Scuole d’infanzia', 'colore' => 'verde'],
        'primaria'   => ['nome' => 'Scuola primaria',   'gruppo' => 'Scuole primarie',   'colore' => 'giallo'],
        'secondaria' => ['nome' => 'Scuola secondaria', 'gruppo' => 'Scuole secondarie', 'colore' => 'acqua'],
    ];

    public const DIETE = [
        'ordinario'              => 'Menu ordinario',
        'senza-carne'            => 'Senza carne',
        'senza-carne-pesce'      => 'Senza carne e pesce',
        'senza-glutine'          => 'Senza glutine',
        'senza-proteine-animali' => 'Senza proteine animali',
        'senza-bovino'           => 'Senza carne di bovino',
        'senza-maiale'           => 'Senza carne di maiale',
    ];

    /** fascia => [dieta => ID del calendario senza suffisso] */
    public const CALENDARI = [
        'nido-6-9' => [
            'ordinario'              => '22cadf211b087481db0e6347b08a74e7bb398a1875e170cd5de60c12ee41639d',
            'senza-carne'            => 'd5ac6e9c8ed54da45a3955055ae8c97517b73bd24f5f025eb21b598a1f4f3778',
            'senza-carne-pesce'      => '791350776b63aa93a62f2b50fcebe2f3ff65f94d698aa7320622e16c41bb751a',
            'senza-proteine-animali' => 'b50de00afe3b75ba750b45cb2d853d7734cae16ec4b14e0638b4d8308f524b07',
            'senza-bovino'           => 'b858dd196c51435416628a67a21ce26e4ebb487cc5c75a751f3a7fba1cf7a865',
            'senza-maiale'           => '96e8204793c00a27637bd2b869ec0926b566bf6b1960fe1c6766b96a01ed43b9',
        ],
        'nido-9-12' => [
            'ordinario'              => '0078da3913c1318791b15a926f2a3a871d99f1a55fefdb938c23eefe60da5c51',
            'senza-carne'            => 'f9e2ebf8e2dbaca091342f232ae7ad217a893c00f123c10e787835873b3effb3',
            'senza-carne-pesce'      => 'f411eb197d5a1433a4556eb040891a0ddf3e49adde1899d6e97306e73de64f9b',
            'senza-proteine-animali' => '084ae1cc7d3c616fbec846ec1854e7cc43426e0d3949fec7f87afa3bde9d61c7',
            'senza-bovino'           => '8e65bea966f113f400e20d9f8565fca31dd62fec1609db0d05c82058f8a10ccc',
            'senza-maiale'           => 'd0fd9d3c4177f7882188fc534c8d206e864a43bce66b7e1d818c68c37781b0d0',
        ],
        'nido-12-36' => [
            'ordinario'              => 'a7063ae5e08707d75f9bdf74c623f9a80d542f17e5f67caeef656ae987555aab',
            'senza-carne'            => 'af5f0f12254cf6a465306b387f28a7689a5a24dec94a62eec5901b5618864105',
            'senza-carne-pesce'      => 'ef717850e544794fb43393248dc3f3c3119b8f8cd2101edff4d1c5da9ca9e4d0',
            'senza-glutine'          => '7c5df2ab093052fd0fe8e9071d57c19a4522df3a7e089fd080a7940d974c8dd2',
            'senza-proteine-animali' => '3827e1cf78b99a4100f80fb891b306fe3de062d8bebc7cc8ae3429e8c91c527b',
            'senza-bovino'           => 'ec1dc2b93181906305a2fbb7bbe2ea3cd81f59b6efb2a21a4123f14b2efd15c6',
            'senza-maiale'           => '024e29ea5d67a3de610be0a78532d58b9b2ee5c79bf47d46b7aa18f1f5b9a5a3',
        ],
        'infanzia' => [
            'ordinario'              => 'd726639efa652aaa438512971eb367fd3cb8cbea901d898f4f5f405a854bb69d',
            'senza-carne'            => 'l0f7trut6ffj7i0sdprhfq8vdg',
            'senza-carne-pesce'      => '84bphg8mnl5hhbjbb5nighj200',
            'senza-glutine'          => 'eso68ec3h662ger2ihta2ibk6g',
            'senza-proteine-animali' => '8a4194aaa885f9c33b3bbde457de5a6796608df52dd2dda4c284904f0184523b',
            'senza-bovino'           => '86cg6ttril5cidkl9u8a8hamas',
            'senza-maiale'           => 'e96b150de2361ae0e5251634c33439c42e0abd44a73f5fa115f173352666fc0b',
        ],
        'primaria' => [
            'ordinario'              => 'hqmct17n9uhpn10l9k9hoc08lo',
            'senza-carne'            => '1su4q2splhe4aip6ps8gvba6h8',
            'senza-carne-pesce'      => 'hh1fq3ih8av7sihfh8bv3soros',
            'senza-glutine'          => 'a3hq7hlq6mflqcqb64in4rpb68',
            'senza-proteine-animali' => 'c94c8c6640203aa32a8820dc394d9cc384073871fc957cc087f277ef6e851296',
            'senza-bovino'           => 'b7da16e86b60daf0ffac3d4a3eac4f92cae4b2d1636ec8748c6d80a967e06d66',
            'senza-maiale'           => 'f05ff9b76db77dea56003f95d4d73bc001887fea830f0c8b993109f81c6519a2',
        ],
        'secondaria' => [
            'ordinario'              => 'alhf1h0c8rtq7oeq0bq6i9jff8',
            'senza-carne'            => 'psme21a0ee86nq717mvcbu8oac',
            'senza-carne-pesce'      => 'l79fahhhq8lncdlfiuravgd128',
            'senza-glutine'          => 'a3c4v1gpjjmkkvlnpcf15f3v94',
            'senza-proteine-animali' => 'inl3h8uumr6ioo5j6c1b08r4n8',
            'senza-bovino'           => 'dehkshofo7k6m17uhel40q40j0',
            'senza-maiale'           => '4adde6c82db955778669c3c7caa8e2e138e1a11662c0229dfd18599d5057a38e',
        ],
    ];

    /** Pagina pubblica del calendario, quella linkata dal sito del Comune. */
    public static function urlUfficiale(string $calendarId): string
    {
        return 'https://calendar.google.com/calendar/embed?src='
            . rawurlencode($calendarId . self::SUFFISSO) . '&ctz=Europe%2FRome';
    }

    public static function urlFeed(string $calendarId): string
    {
        return 'https://calendar.google.com/calendar/ical/'
            . rawurlencode($calendarId . self::SUFFISSO) . '/public/basic.ics';
    }
}
