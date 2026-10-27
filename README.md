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

Tophost non permette il deploy automatico: il sito si carica a mano.

1. Creare il database MySQL su Tophost ed eseguire `migrations/001_schema.sql` in phpMyAdmin
   (con le versioni successive, solo le nuove migrazioni, nell'ordine dei numeri e dopo un backup).
2. Creare lo ZIP con `sh bin/crea-zip.sh` (finisce in `dist/buonapp.zip`), estrarlo e caricare la cartella
   `buonapp` nella radice del sito, in modo che risponda su https://www.entratadisicurezza.com/buonapp.
3. Copiare `src/config.example.php`, compilarlo e caricarlo come `buonapp/src/config.php`.
   Lo ZIP non contiene `config.php`, quindi gli aggiornamenti successivi non lo sovrascrivono.
4. Su GitHub (Settings → Secrets and variables → Actions) impostare il secret `IMPORT_TOKEN`, uguale a
   `token_importazione` di `config.php`, e la variabile `SITE_URL` = `https://www.entratadisicurezza.com/buonapp`.
5. Lanciare a mano il workflow *Importa i menu* (Actions → Run workflow); poi gira da solo ogni mattina.

`src/config.php` non va mai nel repository.
