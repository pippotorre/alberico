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
| 27/10/2026 | Tabelle con prefisso `buonapp_` (`buonapp_fasce`, `buonapp_diete`, `buonapp_menu`, `buonapp_giorni`): il database Tophost è condiviso con altre app. Vale anche per le nuove tabelle. |
| 27/10/2026 | Titolare per l'informativa privacy: gestore di entratadisicurezza.com, info@entratadisicurezza.com. |
| 27/10/2026 | GitHub Actions non raggiunge Tophost: niente workflow. I menu si aggiornano quando qualcuno apre l'app (`POST /api/v1/aggiorna`), al massimo ogni 6 ore; la prenotazione in `buonapp_stato` evita doppi aggiornamenti. `GET /api/v1/stato` mostra l'esito. |
| 27/10/2026 | Pulsante «Installa l’app sul telefono» in fondo alla pagina: compare solo dove il browser lo consente (Android/Chrome) e se l'app non è già installata. |
| 28/10/2026 | Niente storico: l'importatore tiene solo l'ultimo mese, cioè da oggi meno 31 giorni (il 28/10 si vede fino al 27/09), e a ogni aggiornamento cancella i giorni più vecchi (anche per i menu il cui feed non si scarica). Pulizia iniziale con `pulizia-giorni-oltre-un-mese.sql` nei file del progetto. |
| 26/10/2026 | Un feed vuoto o non scaricabile non cancella i giorni già salvati; l'errore resta in `buonapp_menu.ultimo_errore`. |
| 27/10/2026 | **Statistiche di visita con GoatCounter** (senza cookie, nessun dato personale), account unico del dominio https://entratadisicurezza.goatcounter.com. Script in `index.html`; percorso inviato senza `index.html` (`/buonapp/`). Eventi in `js/app.js` (funzione `conta`): `buonapp-installa-clic`, `buonapp-installa-rifiutata`, `buonapp-installata` (anche installando dal menu di Chrome). Se lo script è bloccato (blocco pubblicità, offline) l'app funziona uguale. |
| 27/10/2026 | Informativa privacy aggiornata: tolto «non utilizza strumenti di statistica», aggiunta la sezione «Statistiche di visita». Service worker `buonapp-v13`. |
| 15/11/2026 | **Cinque lingue**: italiano (predefinita), inglese, francese, spagnolo, arabo (da destra a sinistra). Testi in `js/i18n.js`; lingua scelta dal menu nella testata, da `?lang=xx` o dal telefono, salvata sul dispositivo (`buonapp.lingua`). Fasce e diete tradotte per id; **i nomi dei piatti restano in italiano**, con una nota nel piede. Service worker `buonapp-v15`. |
| 15/11/2026 | Informativa privacy unica in cinque lingue, generata da `docs/privacy/genera.py` in `privacy.html` e in `play-store/privacy/buonapp/index.html` (da caricare in `/privacy/buonapp/`, l'indirizzo dato a Google Play). Aggiunti: «non è un'app ufficiale della Città di Torino», minori, base giuridica delle statistiche. |
| 15/11/2026 | Icona dello store (`play-store/grafica/icona-512.png`) rifatta da `img/padella-piatto.png` con margine: nella prima versione il cerchio bianco era tagliato. |
| 15/11/2026 | Google Play: procedura della skill `googleplay-store`. Gratuita, senza pubblicità, **senza acquisti in app**; categoria Cibo e bevande; pubblico 18+ (genitori). Tutto in `play-store/`. |

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

- **Importatore**: all'apertura l'app chiama `POST /api/v1/aggiorna`; se l'ultimo tentativo ha più di 6 ore
  il sito scarica i calendari in quella richiesta (l'app non la aspetta). Forzabile con `POST /api/v1/importa` e token,
  o da riga di comando con `php bin/importa.php`. Legge il feed iCal pubblico di ogni
  calendario (`https://calendar.google.com/calendar/ical/<ID>%40group.calendar.google.com/public/basic.ics`)
  e aggiorna MySQL. Se il Comune corregge un piatto, l'app si aggiorna da sola.
- **Dati** (`migrations/001_schema.sql`, prefisso `buonapp_`): `buonapp_fasce`, `buonapp_diete`,
  `buonapp_menu` (fascia + dieta + ID calendario), `buonapp_giorni` (data + piatti in JSON + testo originale).
- **API JSON** sotto `/api/v1/` (`api/index.php` + `src/routes.php`, come in Reserve):
  - `GET /api/v1/menu` → fasce con le loro diete e l'id di ogni menu;
  - `GET /api/v1/menu/{id}/giorni?da=AAAA-MM-GG&a=AAAA-MM-GG` → piatti per giorno (predefinito: 14 giorni da oggi,
    massimo 62), più `prossimo`, la prima data pubblicata dopo l'intervallo.
- **PWA** (`index.html`, `js/app.js`, `css/app.css`, `manifest.webmanifest`, `sw.js`): home con i preferiti
  (oggi o primo giorno utile), scelta per fascia → età (solo nidi) → dieta, vista settimanale con frecce.
  Il service worker tiene in cache l'interfaccia e le ultime risposte dell'API: si apre anche offline.
- **Diagramma di sequenza** delle interazioni tra i componenti: `docs/architettura-sequenza.mmd` (da incollare in Mermaid).
- **Prove:** `php tests/run.php` (SQLite in memoria, nessuna rete; feed di esempio in `tests/fixtures/`).
- **Nessun dato personale** raccolto nella prima versione.

## Grafica

Grafiche originali in `buonapp-grafiche/` nei file del progetto (icona, banner, volantino).

- Palette: giallo, verde oliva, rosso, verde acqua + arancio della padella.
- Colori per fascia (dal banner): nidi rosso, infanzia verde, primaria giallo, secondaria acqua.
- Logo «BuonApp» con le lettere che cadono nella padella. Icona della PWA (dal 27/10/2026): padella su piatto chiaro e fondo giallo,
  come la schermata di avvio, così su Android la schermata di sistema e quella dell'app coincidono.
- Slogan: «Che si mangia oggi a scuola?».
- Nella PWA: testo scuro su fondo chiaro, il colore della fascia solo come bordo (contrasto sufficiente);
  font di sistema per i testi; strisce del banner come fascia sotto la testata.
- Font (27/10/2026): «buonApp» in **Black Ops One** (simile alle lettere a blocchi del logo), slogan in
  **Emilys Candy** (simile ai riccioli del vecchio volantino). Google Fonts OFL, file in `font/`, solo caratteri latini.
- Schermata di avvio (27/10/2026): padella con le lettere (`img/padella.png`, immagine fornita dall'utente) su fondo giallo,
  con un piatto chiaro dietro perché le lettere gialle si vedano. iPhone e iPad: `img/avvio/` e tag in `index.html`,
  rigenerabili con `python3 docs/avvio/genera.py`; Android: Chrome compone da solo la schermata di sistema (icona + colore), quindi l'app installata
  mostra subito dopo una schermata di avvio in HTML (`#avvio`, `img/padella-piatto.png`) identica a quella di iPhone e iPad,
  per almeno 2,5 secondi. Con l'app del Play Store (TWA) si potrà usare la padella anche nella schermata di sistema.
- Volantino A5 verticale per WhatsApp (27/10/2026): sorgente in `docs/volantino/` (padella su strisce colorate, solo lo slogan, HTML + QR verso
  https://www.entratadisicurezza.com/buonapp/), PNG e PDF con `node docs/volantino/rendi.js docs/volantino`.
- Da fare: un logotipo in SVG al posto del testo «buonApp», schermata di avvio per iPhone.

## Domande aperte

- [x] Dopo il 2 novembre il Comune riusa gli stessi calendari? Sì: verificato il 02/11/2026 (primaria, secondaria,
  infanzia e nido 6–9 ordinari hanno il menu invernale dal 2/11), gli ID restano validi.
- [x] Menu invernale: in infanzia e nidi dopo i piatti c'è un punto e la merenda (es. «PANE .PIZZA AL POMODORO»).
  `Piatti::separa()` divide pranzo e merenda (un punto seguito da «di», «con», ecc. resta un refuso nel nome);
  l'API la restituisce in `merenda` e l'app la mostra su una riga «Merenda» (decisione dell'utente, 04/11/2026).
- [ ] Il server Tophost riesce a scaricare i feed da `calendar.google.com`?
- [x] Cosa mostrare quando un menu non è ancora pubblicato → messaggio «Il Comune non ha ancora pubblicato…»
  e, se c'è, la prima data disponibile.
- [x] Importatore → GitHub Actions che chiama il sito.
- [x] «Messaggio alle famiglie» → testo formale nella PWA quando il menu manca, con link al calendario ufficiale.
- [ ] Il server Tophost raggiunge `calendar.google.com`? (si vede in `/api/v1/stato` dopo la prima apertura)
- [ ] Mostrare anche i PDF del Comune (tabelle dietetiche, grammature)?
- [ ] Notifiche («domani si mangia…») nella prima versione o dopo?
- [x] Dominio e cartella su Tophost → www.entratadisicurezza.com/buonapp.
- [x] Titolare e email di contatto nell'informativa privacy.

## Passi successivi

1. Creare il database su Tophost ed eseguire `migrations/001_schema.sql` in phpMyAdmin.
2. Copiare `src/config.example.php` in `src/config.php` sul server.
3. Caricare la cartella `buonapp` dallo ZIP (`sh bin/crea-zip.sh`) e `src/config.php` compilato.
4. Eseguire `migrations/002_stato.sql` e controllare `/api/v1/stato` dopo la prima apertura dell'app.
5. Ricontrollare i calendari dopo il 2 novembre.

## Google Play

Guida passo passo e risposte ai questionari: **`play-store/CHECKLIST-PLAY-CONSOLE.md`**.

| Voce | Valore |
|---|---|
| Pacchetto | `com.entratadisicurezza.buonapp` |
| Versione | 1.0.0 (versionCode 1), creata il 15/11/2026 |
| Canale | Test chiuso (account personale: 12+ tester per 14 giorni), poi produzione |
| Stato | Pacchetto pronto, da caricare in Play Console |
| Avvio della TWA | `https://www.entratadisicurezza.com/buonapp/?utm_source=twa` (in GoatCounter le visite dall'app si distinguono) |
| Link gestiti dall'app | solo `https://www.entratadisicurezza.com/buonapp/…` (`pathPrefix`), non il resto del dominio |
| Livello API | minSdk 24, targetSdk e compileSdk **36** |
| SHA-256 chiave di caricamento | `96:1C:BE:D8:1F:42:E9:B2:6C:BB:23:9D:F8:CE:D9:D4:04:D5:15:2C:51:47:94:B7:5C:26:00:E8:0A:B0:B2:7F` |
| SHA-256 firma app (Google) | da copiare da Play Console › Integrità dell'app dopo il primo caricamento |
| Chiave di caricamento | `buonapp-upload.jks`, alias `upload`: sul Mac in `~/Documents/EntrataDiSicurezza-Play/chiavi/buonapp/`, mai nel repository |
| Privacy | https://www.entratadisicurezza.com/privacy/buonapp/ |
| Asset Links | `play-store/assetlinks.json` → `https://www.entratadisicurezza.com/.well-known/assetlinks.json` |

Cartella `play-store/`:
- `android/` progetto Bubblewrap 1.27 (senza chiavi); dopo ogni `bubblewrap update` si rilancia `python3 play-store/personalizza-android.py play-store/android`
  (nomi tradotti, `resConfigs`, `pathPrefix=/buonapp/`, Maven Central al posto di jcenter);
- `scheda/<lingua>.md` testi della scheda (caratteri contati), `grafica/` icona, grafica in primo piano, 4 schermate telefono e 2 tablet per lingua
  (rigenerabili con `node play-store/grafica/genera.js`), `sicurezza-dei-dati.md`, `tester/inviti.md`.
- `bin/crea-zip.sh` esclude `play-store/` dallo ZIP del sito.

Il `.aab` da caricare e un APK di prova sono sull'iMac, in `~/Documents/EntrataDiSicurezza-Play/buonapp/` (`buonapp-1.0.0-1.aab`), insieme a
`assetlinks.json` (copia master per `/.well-known/`) e `REGISTRO-APP.md`. Chiave e pacchetto sono stati creati lì, così la chiave non è mai passata dal cloud.
Sull'iMac Node è in `~/.local/node` (non nel PATH: `export PATH=$HOME/.local/node/bin:$PATH`), JDK 17 e Android SDK in `~/.bubblewrap`.

## Verifiche fatte

- 15/11/2026 – Cinque lingue provate in Chromium (telefono 360 px) con i menu veri del sito: nessun errore JavaScript, arabo con `dir="rtl"`,
  frecce e bordi specchiati, piatti in italiano isolati con `<bdi>`. Informativa privacy: una sola sezione visibile per lingua.
- 15/11/2026 – Pacchetto Android (costruito sull'iMac): `jarsigner -verify` sull'`.aab` ok; APK firmato con la chiave di caricamento (SHA-256 uguale a quello sopra);
  `aapt2`: pacchetto `com.entratadisicurezza.buonapp`, targetSdk 36, nomi in it/en/fr/es/ar, `supportsRtl=true`, `pathPrefix=/buonapp/`, nessun permesso.
- 27/10/2026 – Statistiche: prova in Chromium simulando Android con lo script di GoatCounter vero. Una visita per `/buonapp/`
  e i tre eventi di installazione inviati correttamente; nessun errore JavaScript.

## Problemi incontrati

| Data | Problema | Soluzione |
|---|---|---|
| 26/10/2026 | L'ambiente cloud non raggiungeva `www.comune.torino.it` e `calendar.google.com`. | Pagina letta dal browser dell'utente; calendario letto con il connettore Google Calendar. Il deploy e l'importatore girano fuori da qui. |
| 27/10/2026 | Tophost non consente il deploy automatico via FTP da GitHub. | Pacchetto ZIP creato dal repo e caricato a mano; `config.php` separato. |
| 27/10/2026 | Il workflow «Importa i menu» falliva: `curl: (28) Failed to connect … port 443` (Tophost non accetta connessioni dai server di GitHub). | Aggiornamento avviato dalle visite all'app; workflow rimosso. |
| 27/10/2026 | Dopo la prima importazione i nidi non mostravano le età e i menu risultavano «non esistenti»: il browser aveva tenuto in cache per 15 minuti la vecchia risposta vuota di `/api/v1/menu`. | API sempre con `Cache-Control: no-store`, l'app non tiene in memoria un elenco vuoto, service worker v6. |
| 27/10/2026 | Dal 19 al 30 ottobre l'app dice «non ancora pubblicato»: i calendari del Comune finiscono il 16/10, anche se l'avviso dice che si ripetono la 2ª e 3ª settimana estiva. | Comportamento corretto: si mostra il messaggio formale con il link al calendario ufficiale. |
| 15/11/2026 | L'ambiente cloud rifiutava `dl.google.com` (SDK Android) e il sito. | Aggiunti `dl.google.com` e `www.entratadisicurezza.com` agli host consentiti dell'ambiente. |
| 15/11/2026 | Build Bubblewrap: jcenter rinvia a `repo1.maven.org`, che risponde 429; androidbrowserhelper 2.7.4 vuole minSdk 24. | `personalizza-android.py` sostituisce jcenter con la copia Google di Maven Central + `mavenCentral()`; minSdk 24 in `twa-manifest.json`. |
| 15/11/2026 | La chiave creata nel cloud non si poteva portare sul Mac (le istruzioni non possono contenere segreti). | Chiave e `.aab` rifatti sull'iMac con Remote Control; la chiave e il pacchetto del cloud sono stati cancellati. Sull'iMac mancavano Java, Node e SDK: installati nella cartella utente senza sudo. |
