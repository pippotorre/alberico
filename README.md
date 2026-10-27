# buonApp

*Che si mangia oggi a scuola?* — il menu del giorno delle scuole di Torino (nidi, infanzia, primarie,
secondarie), per tutte le diete, come PWA installabile su Android e iPhone.

Le decisioni e il diario del progetto sono in [SVILUPPO.md](SVILUPPO.md).

## Struttura

| Percorso | Contenuto |
|---|---|
| `index.html`, `js/`, `css/`, `img/`, `manifest.webmanifest`, `sw.js` | La PWA |
| `api/index.php` | API JSON `/api/v1/...` |
| `src/` | Classi PHP; `Calendari.php` è l'elenco dei calendari del Comune |
| `bin/importa.php` | Importa i menu dai calendari (una volta al giorno) |
| `migrations/` | Schema MySQL, da eseguire a mano in phpMyAdmin nell'ordine dei numeri |
| `tests/` | Prove su SQLite: `php tests/run.php` |

## Installazione su Tophost

1. Eseguire `migrations/001_schema.sql` in phpMyAdmin.
2. Copiare `src/config.example.php` in `src/config.php` e inserire i dati del database.
3. Generare un token (`php -r 'echo bin2hex(random_bytes(32));'`) e metterlo in `src/config.php`
   (`token_importazione`) e su GitHub come secret `IMPORT_TOKEN`; aggiungere la variabile `SITE_URL`.
4. Lanciare a mano il workflow *Importa i menu* (Actions → Run workflow); poi gira da solo ogni mattina.

`src/config.php` non va mai nel repository.
