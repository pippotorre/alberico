# buonApp su Google Play – guida passo passo

Tutto quello che serve per la prima pubblicazione di **buonApp** (`com.entratadisicurezza.buonapp`,
versione 1.0.0, versionCode 1). Preparato il 15/11/2026. Account Play Console personale, quindi
prima della produzione serve un **test chiuso con almeno 12 tester per 14 giorni consecutivi**.

## Cosa c'è e dove

| Cosa | Dove |
|---|---|
| Pacchetto da caricare (`.aab`) | sull'iMac: `~/Documents/EntrataDiSicurezza-Play/buonapp/buonapp-1.0.0-1.aab` |
| APK di prova, installabile a mano | sull'iMac: `~/Documents/EntrataDiSicurezza-Play/buonapp/buonapp-1.0.0-1-prova.apk` |
| `assetlinks.json` master e registro delle app | sull'iMac: `~/Documents/EntrataDiSicurezza-Play/assetlinks.json` e `REGISTRO-APP.md` |
| Chiave di caricamento e password | sul tuo Mac: `~/Documents/EntrataDiSicurezza-Play/chiavi/buonapp/` (mai nel repository) |
| Progetto Android (Bubblewrap) | `play-store/android/` (rigenerabile: vedi in fondo) |
| `assetlinks.json` da caricare | `play-store/assetlinks.json` |
| Informativa privacy | `play-store/privacy/buonapp/index.html` → `https://www.entratadisicurezza.com/privacy/buonapp/` |
| Testi della scheda | `play-store/scheda/it.md`, `en.md`, `fr.md`, `es.md`, `ar.md` |
| Grafiche | `play-store/grafica/` (icona 512, grafica in primo piano e schermate per lingua) |
| Sicurezza dei dati | `play-store/sicurezza-dei-dati.md` |
| Inviti ai tester | `play-store/tester/inviti.md` |

## Passo 0 – Sul sito (Tophost), prima di tutto

1. Carica il nuovo ZIP dell'app (`sh bin/crea-zip.sh`): contiene le cinque lingue, la nuova
   `privacy.html` e il service worker `buonapp-v15`.
2. Crea la cartella **`/privacy/buonapp/`** nella radice del sito e caricaci `play-store/privacy/buonapp/index.html`.
   Controlla che https://www.entratadisicurezza.com/privacy/buonapp/ si apra, e prova `?lang=ar`.
3. Crea la cartella **`/.well-known/`** nella radice e caricaci `play-store/assetlinks.json`
   (per ora con la sola impronta della chiave di caricamento: va bene così per il primo caricamento).
   Controlla che https://www.entratadisicurezza.com/.well-known/assetlinks.json risponda senza redirect.
   Se Tophost non serve le cartelle che iniziano con il punto, scrivimi: si risolve con un `.htaccess`.

## Passo 1 – Crea l'app in Play Console

**Tutte le app › Crea app**
- Nome dell'app: `buonApp – Menu scuole Torino`
- Lingua predefinita: **Italiano – it-IT**
- App o gioco: **App** · Gratuita o a pagamento: **Gratuita**
  (attenzione: una volta gratuita non può diventare a pagamento)
- Spunta le dichiarazioni (norme del programma per gli sviluppatori, leggi sull'esportazione USA).

## Passo 2 – Configura l'app (Dashboard › «Configura la tua app»)

| Voce | Risposta |
|---|---|
| **Norme sulla privacy** | `https://www.entratadisicurezza.com/privacy/buonapp/` |
| **Accesso all'app** | Tutte le funzionalità sono disponibili senza restrizioni di accesso (nessun login) |
| **Annunci** | **No**, la mia app non contiene annunci |
| **Classificazione dei contenuti** | Vedi sotto (questionario IARC) |
| **Pubblico di destinazione** | Fascia **18 e oltre** soltanto. «L'app potrebbe attirare involontariamente i bambini?» → **No** (è per i genitori: lo dicono testi e grafiche) |
| **App di notizie** | **No** |
| **App per il tracciamento dei contatti / stato di salute COVID-19** | Nessuna delle due |
| **Sicurezza dei dati** | Segui `play-store/sicurezza-dei-dati.md` |
| **App governative** | **No**: buonApp non è sviluppata da né per conto di un ente pubblico (la scheda lo dice: «non è un'app ufficiale della Città di Torino») |
| **Funzionalità finanziarie** | La mia app non offre nessuna funzionalità finanziaria |
| **Salute** | La mia app non ha funzionalità relative alla salute (le diete sono quelle del menu scolastico, non consigli sanitari) |
| **ID pubblicità** | **No**, l'app non usa l'ID pubblicità (nessun permesso `AD_ID` nel pacchetto) |
| **Categoria** | **Cibo e bevande** · Tag: Ricette e cucina (facoltativi) |
| **Dettagli di contatto** | Email `info@entratadisicurezza.com` · Sito `https://www.entratadisicurezza.com` · Telefono: lascia vuoto |

> Pubblico di destinazione: se scegli fasce sotto i 13 anni l'app entra nel programma Famiglie,
> con regole e controlli molto più severi. buonApp è per i genitori, quindi resta su 18+.

### Classificazione dei contenuti (IARC)
- Email: `info@entratadisicurezza.com` · Categoria: **Tutte le altre tipologie di app** (utilità, produttività, comunicazione o altro)
- Violenza, paura, sesso, linguaggio volgare, droghe, alcol e tabacco, gioco d'azzardo, contenuti crudi: **No** a tutto
- Gli utenti possono interagire o scambiarsi contenuti? **No**
- Condivide la posizione dell'utente con altri? **No**
- Permette acquisti di beni digitali? **No**
- Contenuti generati dagli utenti, browser web senza limiti: **No**
  (la TWA apre solo il sito di buonApp; il link al calendario ufficiale apre il browser)
- Risultato atteso: PEGI 3, ESRB Everyone, USK 0.

## Passo 3 – Scheda dello store (Crescita › Presenza nello store › Scheda principale)

1. Lingua predefinita **it-IT**: copia titolo, descrizione breve e completa da `play-store/scheda/it.md`.
2. **Gestisci traduzioni › Aggiungi le tue traduzioni**: aggiungi **en-US**, **fr-FR**, **es-ES**, **ar**
   e copia i testi dai rispettivi file. Per l'arabo, Play Console impagina da destra a sinistra da sola.
   Non attivare la traduzione automatica di Google: le traduzioni sono già pronte.
3. Grafiche (per ogni lingua carica le sue; l'icona è una sola):
   - Icona dell'app: `play-store/grafica/icona-512.png` (512×512, 32 bit)
   - Grafica in primo piano: `play-store/grafica/<lingua>/feature-1024x500.png`
   - Screenshot telefono: `play-store/grafica/<lingua>/telefono-01.png` … `telefono-04.png` (1080×1920)
   - Screenshot tablet 7" **e** 10": `play-store/grafica/<lingua>/tablet-01.png`, `tablet-02.png` (1600×2560; vanno bene per entrambi)
   - Video: nessuno.

## Passo 4 – Test chiuso (obbligatorio per il tuo account)

1. **Test e rilascio › Test › Test chiuso › Alpha › Gestisci canale**.
2. **Tester**: crea un elenco email (es. «Genitori buonApp») con **almeno 15 indirizzi Gmail/Google**
   (12 è il minimo: con qualche persona in più non riparte il conteggio se qualcuno esce).
   Aggiungi l'email per il feedback `info@entratadisicurezza.com`.
3. **Paesi**: almeno **Italia** (consigliati anche Francia, Spagna, Svizzera, Belgio: chi si iscrive deve essere in un paese incluso).
4. **Crea nuova release**:
   - **Firma dell'app di Google Play**: accetta (Google conserva la chiave di firma; tu tieni quella di caricamento).
   - Carica `buonapp-1.0.0-1.aab`.
   - Nome della release: `1.0.0 (1)`. Note di rilascio: dai file `scheda/*.md` (sezione «Note di rilascio»),
     una per lingua, nel formato `<it-IT>…</it-IT>`, `<en-US>…</en-US>`, `<fr-FR>…</fr-FR>`, `<es-ES>…</es-ES>`, `<ar>…</ar>`.
5. **Invia per la revisione** (Panoramica pubblicazione). La prima revisione può richiedere qualche giorno.
6. Appena caricato l'`.aab`: **Test e rilascio › Configurazione › Integrità dell'app › Firma dell'app**,
   copia l'**impronta SHA-256 del certificato della chiave di firma dell'app** e mandamela (o mettila tu
   al posto di `SOSTITUIRE_CON_SHA256_FIRMA_APP_DI_GOOGLE_PLAY` in `play-store/assetlinks.json`),
   poi ricarica il file in `/.well-known/`. **Senza questo passaggio l'app scaricata dal Play Store mostra
   la barra dell'indirizzo in alto.**
7. Dopo l'approvazione, copia il **link di adesione** (Tester › «Partecipa dal web») e manda gli inviti
   di `play-store/tester/inviti.md`, nella lingua di ciascuno.

### Come verificare i Digital Asset Links
- Online: https://developers.google.com/digital-asset-links/tools/generator
  (sito `https://www.entratadisicurezza.com`, pacchetto `com.entratadisicurezza.buonapp`, impronta SHA-256 della firma app).
- Sul telefono: se aprendo buonApp scaricata dal Play Store compare la barra con l'indirizzo, il file
  non è ancora valido (impronta mancante, file non raggiungibile o servito con redirect). Dopo aver corretto
  il file, cancella i dati di Chrome o reinstalla l'app.

## Passo 5 – Dopo 14 giorni: accesso alla produzione

**Dashboard › Richiedi l'accesso alla produzione**. Bozza delle risposte (da completare con i dati veri, non inventarli):
- *Come hai reclutato i tester?* Genitori di bambini che frequentano nidi e scuole di Torino, contattati
  tramite chat di classe e conoscenti; [numero] tester iscritti per 14 giorni.
- *Come hanno usato l'app?* Consultazione del menu del giorno e della settimana, salvataggio dei preferiti,
  uso senza connessione, prova delle lingue (in particolare [lingue]).
- *Che feedback hai ricevuto e cosa hai cambiato?* [Feedback reali] → [modifiche fatte, con la versione].
- *Pubblico e valore dell'app*: famiglie di Torino che vogliono sapere cosa mangiano i figli a scuola,
  in cinque lingue, anche per le famiglie straniere.
- *Perché è pronta*: [cosa dimostra il test: nessun arresto anomalo, menu sempre aggiornati, ecc.].

Dopo l'approvazione: **Produzione › Crea nuova release** con lo stesso `.aab` (o uno nuovo con versionCode più alto),
paesi di distribuzione (consigliato: **Italia**, oppure tutti), rilascio graduale facoltativo.

## Aggiornamenti futuri

Quasi tutte le modifiche (menu, testi, grafica dell'app) **non** richiedono un nuovo `.aab`: basta aggiornare
il sito, la TWA mostra sempre la versione online. Serve un nuovo pacchetto solo se cambiano nome, icona,
colori di sistema, indirizzo di partenza o il livello API richiesto da Google.

Per rifare il pacchetto:
1. In `play-store/android/twa-manifest.json` aumenta `appVersionCode` (2, 3, …) e `appVersionName`.
2. Copia la chiave `buonapp-upload.jks` dal Mac in `play-store/chiavi/buonapp/` (cartella ignorata da git) o indica il percorso.
3. `cd play-store/android && bubblewrap update --skipVersionUpgrade && python3 ../personalizza-android.py .`
4. `bubblewrap build --skipPwaValidation` (password dal file delle credenziali) e carica il nuovo `.aab`.
5. Controlla che `targetSdkVersion` sia almeno quello richiesto da Google in quel momento (oggi **36**).
