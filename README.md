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

Tophost non permette il deploy automatico e non accetta chiamate da GitHub: il sito si carica a mano
e i menu si aggiornano da soli quando qualcuno apre l'app (al massimo ogni 6 ore).

1. Nel database MySQL eseguire in phpMyAdmin le migrazioni di `migrations/` nell'ordine dei numeri
   (con un backup prima). Le tabelle hanno il prefisso `buonapp_`.
2. Creare lo ZIP con `sh bin/crea-zip.sh` (finisce in `dist/buonapp.zip`), estrarlo e caricare la cartella
   `buonapp` nella radice del sito, in modo che risponda su https://www.entratadisicurezza.com/buonapp.
3. Copiare `src/config.example.php`, compilarlo e caricarlo come `buonapp/src/config.php`.
   Lo ZIP non contiene `config.php`, quindi gli aggiornamenti successivi non lo sovrascrivono.
4. Aprire l'app: la prima apertura avvia il download dei calendari. Dopo un minuto
   https://www.entratadisicurezza.com/buonapp/api/v1/stato mostra quanti menu sono stati importati
   e gli eventuali errori.

`src/config.php` non va mai nel repository.
