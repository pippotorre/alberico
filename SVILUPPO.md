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

## Proposta di architettura (da confermare)

- **Importatore** (`cron` su Tophost, una volta al giorno): legge il feed iCal pubblico di ogni
  calendario (`https://calendar.google.com/calendar/ical/<ID>%40group.calendar.google.com/public/basic.ics`)
  e aggiorna MySQL. Se il Comune corregge un piatto, l'app si aggiorna da sola.
- **Dati:** `fasce` → `diete` → `menu` (fascia + dieta + ID calendario) → `giorni` (data + elenco piatti).
- **API JSON** sotto `/api/v1/` come in Reserve, es. `GET /api/v1/menu/{id}/giorni?da=…&a=…`.
- **PWA:** `manifest.json`, service worker con cache dell'ultima settimana (funziona anche offline),
  preferiti salvati sul dispositivo (non serve registrarsi).
- **Nessun dato personale** raccolto nella prima versione.

## Grafica

Grafiche originali in `buonapp-grafiche/` nei file del progetto (icona, banner, volantino).

- Palette: giallo, verde oliva, rosso, verde acqua + arancio della padella.
- Colori per fascia (dal banner): nidi rosso, infanzia verde, primaria giallo, secondaria acqua.
- Logo «BuonApp» con le lettere che cadono nella padella → icona della PWA.
- Slogan: «Che si mangia oggi a scuola?».
- Da migliorare: font leggibile per i testi (il font del logo solo per il titolo), contrasti
  (es. giallo su verde) per l'accessibilità.

## Domande aperte

- [ ] Dopo il 2 novembre il Comune riusa gli stessi calendari o ne crea di nuovi? (ricontrollare)
- [ ] Il server Tophost riesce a scaricare i feed da `calendar.google.com`?
- [ ] Cosa mostrare quando un menu non è ancora pubblicato (oggi: dal 17/10 al 1/11)?
- [ ] Mostrare anche i PDF del Comune (tabelle dietetiche, grammature)?
- [ ] Notifiche («domani si mangia…») nella prima versione o dopo?
- [ ] Dominio e cartella su Tophost.

## Problemi incontrati

| Data | Problema | Soluzione |
|---|---|---|
| 26/10/2026 | L'ambiente cloud non raggiungeva `www.comune.torino.it` e `calendar.google.com`. | Pagina letta dal browser dell'utente; calendario letto con il connettore Google Calendar. Il deploy e l'importatore girano fuori da qui. |
