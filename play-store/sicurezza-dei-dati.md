# buonApp – Sicurezza dei dati (Play Console)

Risposte proposte per **Norme › Contenuti dell'app › Sicurezza dei dati**, preparate il 15/11/2026
in base a quello che l'app fa davvero (versione 1.0.0, PWA `buonapp-v15`).

> La dichiarazione finale è responsabilità di chi pubblica: ricontrollala se l'app cambia
> (nuove statistiche, account, notifiche, acquisti) e tienila allineata all'informativa
> https://www.entratadisicurezza.com/privacy/buonapp/

## Cosa fa l'app con i dati (riassunto)

| Dato | Dove va | Note |
|---|---|---|
| Menu preferiti, lingua scelta | Solo sul telefono (`localStorage`) | Mai inviati al server |
| Copia dei menu visti (offline) | Solo sul telefono (cache del service worker) | |
| Pagine visitate, eventi «Installa l'app» | GoatCounter (statistiche) | Senza cookie, IP non salvato, dati aggregati |
| Richieste al sito (log del server) | Tophost | Log tecnici dell'hosting, non usati da buonApp |

Permessi Android dell'app: nessuno (verificato con `aapt2 dump permissions`: solo il permesso
interno `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` aggiunto da AndroidX). Nessun ID pubblicità.

## Risposte, schermata per schermata

### 1. Raccolta e sicurezza dei dati
- **La tua app raccoglie o condivide uno dei tipi di dati utente richiesti?** → **Sì**
  (scelta prudente: GoatCounter riceve dal dispositivo le pagine visitate).
- **Tutti i dati utente raccolti dalla tua app sono criptati in transito?** → **Sì** (solo HTTPS).
- **Quali dei seguenti metodi di creazione dell'account supporta la tua app?** → **La mia app non consente agli utenti di creare un account**.
- **Gli utenti possono chiedere l'eliminazione dei dati?** → Non richiesto senza account. Se la domanda compare,
  rispondi **Sì** e indica che si può scrivere a info@entratadisicurezza.com (i dati sono comunque aggregati e anonimi).

### 2. Tipi di dati
Seleziona **solo**:
- **Attività nell'app › Interazioni con l'app** (pagine visitate, pulsante «Installa l'app»).

Tutto il resto **non** selezionato: posizione, informazioni personali, finanziarie, salute, messaggi,
foto, audio, file, calendario, contatti, cronologia web, informazioni e prestazioni dell'app (niente
log di arresti anomali), ID dispositivo o altri ID.

> Nota sul paese: GoatCounter ricava il paese dall'IP e poi scarta l'IP. Google considera
> «posizione approssimativa» un'area di almeno 3 km²; il paese è molto più ampio e non viene
> salvato con un identificativo, quindi non si dichiara come posizione.

### 3. Utilizzo e gestione di «Interazioni con l'app»
- **Raccolti / Condivisi**: **Raccolti** sì; **Condivisi** no (GoatCounter agisce come fornitore di
  servizi per conto dello sviluppatore, e Google non lo considera condivisione).
- **I dati vengono elaborati in modo temporaneo?** → **No** (le statistiche aggregate restano su GoatCounter).
- **La raccolta è obbligatoria o facoltativa?** → **Obbligatoria** (l'app non ha un'opzione per disattivarla;
  di fatto non avviene se lo script è bloccato).
- **Perché vengono raccolti?** → **Analisi**. Nient'altro (no pubblicità, no personalizzazione, no prevenzione frodi).

### 4. Anteprima
Controlla che la scheda mostri: «Questa app può raccogliere: Attività nelle app», «I dati sono
criptati in transito», nessun dato condiviso con terze parti.

## Se l'app cambia
- **Acquisti in app (versione premium)**: i dati di pagamento li tratta Google Play; non si dichiarano come
  raccolti dall'app, ma va aggiornata l'informativa.
- **Notifiche, account, sincronizzazione dei preferiti sul server**: vanno aggiunti i tipi di dati
  corrispondenti (es. «Informazioni personali › ID utente») e aggiornata l'informativa.
