# buonApp — note di sviluppo

Diario del progetto: decisioni prese, fonti, domande aperte. Si aggiorna a ogni passo.

## Obiettivo

Rifare **buonApp**, l'app per le famiglie che dice *«Che si mangia oggi a scuola?»*:
il menu del giorno della ristorazione scolastica della Città di Torino, dal nido alla
scuola secondaria di primo grado, per tutti i menu disponibili. L'utente può salvare
**due menu preferiti**.

## Decisioni prese

| Data | Decisione |
|---|---|
| 26/10/2026 | Si parte da zero: il repository era vuoto. |
| 26/10/2026 | **PWA** (installabile su Android e iPhone dalla schermata Home), niente app native. |
| 26/10/2026 | Stesso stack di Reserve: PHP + MySQL su Tophost, HTML/JS senza librerie né build. |
| 26/10/2026 | Stesso flusso di lavoro di Reserve: ramo → pull request → merge su `main` → deploy con GitHub Actions + `lftp`. Credenziali solo nei secrets di GitHub. |
| 26/10/2026 | Fonte dei dati: i Google Calendar pubblici del Comune, letti direttamente dal server (non serve copiarli su un account personale). |
| 26/10/2026 | Un «menu» è la coppia **fascia scolastica + dieta** (es. «Primaria – ordinario»). |
| 26/10/2026 | Preferiti (massimo 2) salvati solo sul dispositivo: niente account, nessun dato personale. |
| 26/10/2026 | L'elenco dei calendari sta in un solo file (`src/Calendari.php`); l'importatore riallinea il database da lì. |
| 27/10/2026 | Messaggio alle famiglie quando il menu non è pubblicato: tono formale, senza emoticon, con il link «Vai al calendario ufficiale» (pagina Google Calendar del Comune per quel menu). |
| 27/10/2026 | Importazione giornaliera con GitHub Actions che chiama il sito (`POST /api/v1/importa` con token); il sito scarica i calendari nel suo MySQL. |
| 27/10/2026 | Indirizzo del sito: **https://www.entratadisicurezza.com/buonapp** (Tophost). |
| 27/10/2026 | App Android sul Play Store come **PWA impacchettata** (Trusted Web Activity): una sola base di codice. Nuovo account sviluppatore (il vecchio è stato disattivato), quindi nuova scheda e nuovo nome del pacchetto. iPhone resta sulla PWA. |
| 27/10/2026 | Informativa privacy in `privacy.html`: nessun dato personale raccolto, preferiti solo sul dispositivo. |
| 27/10/2026 | Tophost non permette il deploy automatico: si carica a mano lo ZIP creato da `bin/crea-zip.sh` (cartella `buonapp`). `config.php` si compila e si carica a parte, non è nello ZIP né nel repo. |
| 26/10/2026 | Un feed vuoto o non scaricabile non cancella i giorni già salvati; l'errore resta in `menu.ultimo_errore`. |

## Fonte dei dati

- Pagina del Comune: https://www.comune.torino.it/schede-informative/ristorazione-scolastica-menu
- Elenco dei 40 calendari (6 fasce × 6–7 diete) con gli ID: `fonti/calendari-menu.md` nei file del progetto
  (da copiare nel repo come dato di configurazione quando si scrive l'importatore).
- Fasce: nido 6–9 mesi, nido 9–12 mesi, nido 12–36 mesi, infanzia, primaria, secondaria.
- Diete: ordinario, senza carne, senza carne e pesce, senza glutine (non per tutte le fasce),
  senza proteine animali, senza carne di bovino, senza carne di maiale.

**Formato osservato** (calendario «Sc. primaria menù ordinario», letto il 26/10/2026):

- un evento «tutto il giorno» per ogni giorno di scuola, niente nei festivi;
- i piatti sono nel **titolo**, separati da virgole, in maiuscolo:
  `RISO AL POMODORO, CROCCHETTE DI PLATESSA AL FORNO, FAGIOLINI SALTATI ALL’OLIO, PANE, FRUTTA DI STAGIONE`;
- il testo non è sempre pulito (spazi doppi, punti nel mezzo: `POLPETTE. DI BOVINO`), va normalizzato;
- gli eventi del menu estivo finiscono il **16/10/2026**.

**Avviso del Comune (ottobre 2026):** nelle ultime due settimane di ottobre resta in vigore la
2ª e 3ª settimana del menu estivo; il **menu invernale parte dal 2 novembre**. I PDF invernali
sono già online, i calendari non ancora.

## Architettura

- **Importatore**: `.github/workflows/importa.yml` ogni giorno feriale alle 5:15 (ora solare) chiama
  `POST /api/v1/importa` con `Authorization: Bearer <IMPORT_TOKEN>`; si può lanciare a mano da Actions → *Run workflow*.
  In alternativa `php bin/importa.php` da riga di comando. Legge il feed iCal pubblico di ogni
  calendario (`https://calendar.google.com/calendar/ical/<ID>%40group.calendar.google.com/public/basic.ics`)
  e aggiorna MySQL. Se il Comune corregge un piatto, l'app si aggiorna da sola.
- **Dati** (`migrations/001_schema.sql`): `fasce`, `diete`, `menu` (fascia + dieta + ID calendario),
  `giorni` (data + piatti in JSON + testo originale).
- **API JSON** sotto `/api/v1/` (`api/index.php` + `src/routes.php`, come in Reserve):
  - `GET /api/v1/menu` → fasce con le loro diete e l'id di ogni menu;
  - `GET /api/v1/menu/{id}/giorni?da=AAAA-MM-GG&a=AAAA-MM-GG` → piatti per giorno (predefinito: 14 giorni da oggi,
    massimo 62), più `prossimo`, la prima data pubblicata dopo l'intervallo.
- **PWA** (`index.html`, `js/app.js`, `css/app.css`, `manifest.webmanifest`, `sw.js`): home con i preferiti
  (oggi o primo giorno utile), scelta per fascia → età (solo nidi) → dieta, vista settimanale con frecce.
  Il service worker tiene in cache l'interfaccia e le ultime risposte dell'API: si apre anche offline.
- **Prove:** `php tests/run.php` (SQLite in memoria, nessuna rete; feed di esempio in `tests/fixtures/`).
- **Nessun dato personale** raccolto nella prima versione.

## Grafica

Grafiche originali in `buonapp-grafiche/` nei file del progetto (icona, banner, volantino).

- Palette: giallo, verde oliva, rosso, verde acqua + arancio della padella.
- Colori per fascia (dal banner): nidi rosso, infanzia verde, primaria giallo, secondaria acqua.
- Logo «BuonApp» con le lettere che cadono nella padella → icona della PWA.
- Slogan: «Che si mangia oggi a scuola?».
- Nella PWA: testo scuro su fondo chiaro, il colore della fascia solo come bordo (contrasto sufficiente);
  font di sistema per i testi; strisce del banner come fascia sotto la testata.
- Da fare: un logotipo in SVG al posto del testo «buonApp», schermata di avvio per iPhone.

## Domande aperte

- [ ] Dopo il 2 novembre il Comune riusa gli stessi calendari o ne crea di nuovi? (ricontrollare)
- [ ] Il server Tophost riesce a scaricare i feed da `calendar.google.com`?
- [x] Cosa mostrare quando un menu non è ancora pubblicato → messaggio «Il Comune non ha ancora pubblicato…»
  e, se c'è, la prima data disponibile.
- [x] Importatore → GitHub Actions che chiama il sito.
- [x] «Messaggio alle famiglie» → testo formale nella PWA quando il menu manca, con link al calendario ufficiale.
- [ ] Il server Tophost raggiunge `calendar.google.com`? (si vede alla prima esecuzione del workflow)
- [ ] Mostrare anche i PDF del Comune (tabelle dietetiche, grammature)?
- [ ] Notifiche («domani si mangia…») nella prima versione o dopo?
- [x] Dominio e cartella su Tophost → www.entratadisicurezza.com/buonapp.
- [ ] Titolare e email di contatto da inserire nell'informativa privacy.

## Passi successivi

1. Creare il database su Tophost ed eseguire `migrations/001_schema.sql` in phpMyAdmin.
2. Copiare `src/config.example.php` in `src/config.php` sul server.
3. Caricare la cartella `buonapp` dallo ZIP (`sh bin/crea-zip.sh`) e `src/config.php` compilato.
4. Impostare su GitHub il secret `IMPORT_TOKEN` e la variabile `SITE_URL`, e mettere lo stesso token in `src/config.php`.
5. Ricontrollare i calendari dopo il 2 novembre.

## Play Store (piano)

1. Sito online in HTTPS su https://www.entratadisicurezza.com/buonapp e importazione funzionante.
2. Pacchetto Android con PWABuilder (https://www.pwabuilder.com) o Bubblewrap partendo dall'indirizzo del sito:
   nome del pacchetto proposto `com.entratadisicurezza.buonapp`.
3. Caricare il file `assetlinks.json` generato in **`https://www.entratadisicurezza.com/.well-known/assetlinks.json`**
   (alla radice del dominio, non in `/buonapp`), con l'impronta SHA-256 della chiave di firma di Google Play.
   Senza questo file l'app mostra la barra dell'indirizzo.
4. Scheda del Play Store: descrizione, icona 512×512, grafica in evidenza 1024×500 (c'è già il banner originale),
   schermate del telefono, link all'informativa privacy, sezione «Sicurezza dei dati»: nessun dato raccolto o condiviso.
5. Account personale nuovo: Google chiede un periodo di test chiuso con un gruppo di tester prima della
   produzione (verificare le regole in vigore al momento).

## Problemi incontrati

| Data | Problema | Soluzione |
|---|---|---|
| 26/10/2026 | L'ambiente cloud non raggiungeva `www.comune.torino.it` e `calendar.google.com`. | Pagina letta dal browser dell'utente; calendario letto con il connettore Google Calendar. Il deploy e l'importatore girano fuori da qui. |
| 27/10/2026 | Tophost non consente il deploy automatico via FTP da GitHub. | Pacchetto ZIP creato dal repo e caricato a mano; `config.php` separato. |
