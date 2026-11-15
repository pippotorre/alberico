// buonApp – PWA senza librerie. Viste: home (#/), scelta del menu (#/nidi, #/fascia/ID), settimana (#/menu/ID).
'use strict';

(function () {
  const API = 'api/v1';
  const MAX_PREFERITI = 2;
  const CHIAVE_PREFERITI = 'buonapp.preferiti';
  const vista = document.getElementById('vista');
  const L = window.buonappLingua; // testi nella lingua scelta (js/i18n.js)
  const t = L.t;
  L.applica();

  let elenco = null; // risposta di /menu, caricata una volta

  // --- Preferiti (solo su questo dispositivo) ---
  function leggiPreferiti() {
    try {
      const v = JSON.parse(localStorage.getItem(CHIAVE_PREFERITI) || '[]');
      return Array.isArray(v) ? v.filter(Number.isInteger).slice(0, MAX_PREFERITI) : [];
    } catch (e) {
      return [];
    }
  }
  function salvaPreferiti(lista) {
    try {
      localStorage.setItem(CHIAVE_PREFERITI, JSON.stringify(lista));
    } catch (e) { /* navigazione privata: i preferiti valgono solo per questa visita */ }
  }
  let preferiti = leggiPreferiti();

  // --- Date ---
  const fmtGiorno = new Intl.DateTimeFormat(L.locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtBreve = new Intl.DateTimeFormat(L.locale, { day: 'numeric', month: 'short' });
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function daIso(s) {
    const [a, m, g] = s.split('-').map(Number);
    return new Date(a, m - 1, g);
  }
  function piuGiorni(d, n) {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c;
  }
  function lunedi(d) {
    return piuGiorni(d, -((d.getDay() + 6) % 7));
  }
  function nomeGiorno(s) {
    const oggi = iso(new Date());
    const domani = iso(piuGiorni(new Date(), 1));
    const testo = fmtGiorno.format(daIso(s));
    if (s === oggi) return t('oggi', { giorno: testo });
    if (s === domani) return t('domani', { giorno: testo });
    return testo.charAt(0).toUpperCase() + testo.slice(1);
  }

  // --- Utilità ---
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  async function api(percorso) {
    // no-cache: il browser ricontrolla sempre con il sito, così un menu appena importato si vede subito.
    const r = await fetch(API + percorso, { cache: 'no-cache', headers: { Accept: 'application/json' } });
    const dati = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(dati.errore || 'Errore ' + r.status);
    return dati;
  }
  async function caricaElenco() {
    if (!elenco) {
      const r = await api('/menu');
      // Un elenco vuoto non si tiene in memoria: alla prossima vista si richiede.
      if (!r.fasce || !r.fasce.length) throw new Error('elenco vuoto');
      elenco = r;
    }
    return elenco;
  }
  function trovaMenu(id) {
    for (const f of elenco.fasce) {
      for (const d of f.diete) {
        if (d.menu === id) return { fascia: f, dieta: d };
      }
    }
    return null;
  }
  function mostra(html) {
    vista.innerHTML = html;
    vista.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  function listaPiatti(piatti, merenda) {
    // I piatti restano in italiano: <bdi> li tiene in ordine anche nella pagina in arabo.
    return '<ul class="piatti">' + piatti.map((p) => '<li><bdi lang="it">' + esc(p) + '</bdi></li>').join('') + '</ul>' +
      (merenda && merenda.length ? '<p class="merenda"><strong>' + esc(t('merenda')) + '</strong> <bdi lang="it">' + esc(merenda.join(', ')) + '</bdi></p>' : '');
  }
  // Testi rivolti alle famiglie quando il menu non c'è: tono formale, con il rimando alla fonte ufficiale.
  function linkUfficiale(m) {
    return '<a href="' + esc(m.dieta.calendario) + '" target="_blank" rel="noopener">' + esc(t('calendarioUfficiale')) + '</a>';
  }
  function messaggioVuoto(m, prossimo) {
    let testo = esc(t('nonPubblicato'));
    if (prossimo) testo += ' ' + esc(t('primoPubblicato', { giorno: fmtGiorno.format(daIso(prossimo)) }));
    return '<div class="vuoto"><p>' + testo + '</p><p>' + linkUfficiale(m) + '</p></div>';
  }
  function messaggioErrore(m) {
    return '<div class="vuoto"><p>' + esc(t('erroreMenu')) + '</p>' +
      '<p>' + linkUfficiale(m) + '</p></div>';
  }

  // --- Viste ---
  const GRUPPI = [
    { href: '#/nidi', id: 'nidi', colore: 'rosso' },
    { href: '#/fascia/infanzia', id: 'infanzia', colore: 'verde' },
    { href: '#/fascia/primaria', id: 'primaria', colore: 'giallo' },
    { href: '#/fascia/secondaria', id: 'secondaria', colore: 'acqua' },
  ];

  async function home() {
    await caricaElenco();
    let html = '';
    if (preferiti.length) {
      const oggi = new Date();
      const schede = await Promise.all(preferiti.map(async (id) => {
        const m = trovaMenu(id);
        if (!m) return '';
        try {
          // Prossimi 14 giorni: se oggi non c'è scuola si mostra il primo giorno utile.
          const r = await api('/menu/' + id + '/giorni?da=' + iso(oggi) + '&a=' + iso(piuGiorni(oggi, 13)));
          const g = r.giorni[0];
          const corpo = g
            ? '<h3' + (g.data === iso(oggi) ? ' class="oggi"' : '') + '>' + esc(nomeGiorno(g.data)) + '</h3>' + listaPiatti(g.piatti, g.merenda)
            : messaggioVuoto(m, r.prossimo);
          return scheda(m, corpo, id);
        } catch (e) {
          return scheda(m, messaggioErrore(m), id);
        }
      }));
      html += '<h1>' + esc(t('tuoiMenu')) + '</h1>' + schede.join('');
      html += '<h2>' + esc(t('altriMenu')) + '</h2>';
    } else {
      html += '<h1>' + esc(t('scegliMenu')) + '</h1><p class="sotto">' + esc(t('scegliMenuNota')) + '</p>';
    }
    html += '<ul class="scelte">' + GRUPPI.map((g) =>
      '<li><a class="scelta c-' + g.colore + '" href="' + g.href + '"><span>' + esc(L.gruppo(g.id)[0]) + '<small>' + esc(L.gruppo(g.id)[1]) + '</small></span></a></li>'
    ).join('') + '</ul>';
    mostra(html);
  }

  function scheda(m, corpo, id) {
    return '<section class="scheda c-' + esc(m.fascia.colore) + '">' +
      '<h2>' + esc(L.fascia(m.fascia)) + ' · ' + esc(L.dieta(m.dieta)) + '</h2>' + corpo +
      '<div class="azioni"><a href="#/menu/' + id + '">' + esc(t('tuttaSettimana')) + '</a></div></section>';
  }

  async function nidi() {
    await caricaElenco();
    const fasce = elenco.fasce.filter((f) => f.id.startsWith('nido-'));
    mostra('<a class="indietro" href="#/">' + esc(t('home')) + '</a><h1>' + esc(L.gruppo('nidi')[0]) + '</h1><p class="sotto">' + esc(t('scegliEta')) + '</p>' +
      '<ul class="scelte">' + fasce.map((f) =>
        '<li><a class="scelta c-' + esc(f.colore) + '" href="#/fascia/' + esc(f.id) + '">' + esc(L.fascia(f)) + '</a></li>'
      ).join('') + '</ul>');
  }

  async function fascia(id) {
    await caricaElenco();
    const f = elenco.fasce.find((x) => x.id === id);
    if (!f) return nonTrovato();
    const indietro = id.startsWith('nido-') ? '#/nidi' : '#/';
    mostra('<a class="indietro" href="' + indietro + '">' + esc(t('indietro')) + '</a><h1>' + esc(L.fascia(f)) + '</h1><p class="sotto">' + esc(t('scegliDieta')) + '</p>' +
      '<ul class="scelte">' + f.diete.map((d) =>
        '<li><a class="scelta c-' + esc(f.colore) + '" href="#/menu/' + d.menu + '">' + esc(L.dieta(d)) + '</a></li>'
      ).join('') + '</ul>');
  }

  async function settimana(id, inizioIso) {
    await caricaElenco();
    const m = trovaMenu(id);
    if (!m) return nonTrovato();
    const inizio = inizioIso ? lunedi(daIso(inizioIso)) : lunedi(new Date());
    const fine = piuGiorni(inizio, 4);
    let corpo;
    try {
      const r = await api('/menu/' + id + '/giorni?da=' + iso(inizio) + '&a=' + iso(fine));
      corpo = r.giorni.length
        ? r.giorni.map((g) => '<section class="scheda c-' + esc(m.fascia.colore) + '"><h3' +
            (g.data === iso(new Date()) ? ' class="oggi"' : '') + '>' + esc(nomeGiorno(g.data)) + '</h3>' + listaPiatti(g.piatti, g.merenda) + '</section>').join('') +
          '<p class="fonte">' + esc(t('fonte')) + ' ' + linkUfficiale(m) + '</p>'
        : messaggioVuoto(m, r.prossimo);
      aggiornato(r.menu.aggiornato);
    } catch (e) {
      corpo = messaggioErrore(m);
    }
    const preferito = preferiti.includes(id);
    mostra('<a class="indietro" href="#/fascia/' + esc(m.fascia.id) + '">' + esc(t('indietro')) + '</a>' +
      '<h1>' + esc(L.fascia(m.fascia)) + '</h1><p class="sotto">' + esc(L.dieta(m.dieta)) + '</p>' +
      '<p><button type="button" class="preferito" aria-pressed="' + preferito + '" data-menu="' + id + '">' +
      esc(t(preferito ? 'neiPreferiti' : 'aggiungiPreferiti')) + '</button></p>' +
      '<p id="msg-preferiti" class="avviso" hidden></p>' +
      '<nav class="settimana-nav" aria-label="' + esc(t('settimana')) + '">' +
        '<a class="bottone" href="#/menu/' + id + '/' + iso(piuGiorni(inizio, -7)) + '" aria-label="' + esc(t('settimanaPrecedente')) + '">' + (L.rtl ? '›' : '‹') + '</a>' +
        '<strong>' + esc(fmtBreve.format(inizio)) + ' – ' + esc(fmtBreve.format(fine)) + '</strong>' +
        '<a class="bottone" href="#/menu/' + id + '/' + iso(piuGiorni(inizio, 7)) + '" aria-label="' + esc(t('settimanaSuccessiva')) + '">' + (L.rtl ? '‹' : '›') + '</a>' +
      '</nav>' + corpo);
  }

  function nonTrovato() {
    mostra('<a class="indietro" href="#/">' + esc(t('home')) + '</a><p class="vuoto">' + esc(t('nonTrovato')) + '</p>');
  }

  function aggiornato(quando) {
    const el = document.getElementById('aggiornato');
    if (el && quando) el.textContent = t('aggiornato', { quando: new Date(quando.replace(' ', 'T')).toLocaleString(L.locale, { dateStyle: 'long', timeStyle: 'short' }) });
  }

  // Aggiunge o toglie un preferito; con due preferiti già salvati chiede di toglierne uno.
  vista.addEventListener('click', (ev) => {
    const b = ev.target.closest('button.preferito');
    if (!b) return;
    const id = Number(b.dataset.menu);
    const msg = document.getElementById('msg-preferiti');
    if (preferiti.includes(id)) {
      preferiti = preferiti.filter((x) => x !== id);
    } else if (preferiti.length >= MAX_PREFERITI) {
      msg.hidden = false;
      msg.textContent = t('troppiPreferiti');
      return;
    } else {
      preferiti = preferiti.concat(id);
    }
    salvaPreferiti(preferiti);
    const on = preferiti.includes(id);
    b.setAttribute('aria-pressed', String(on));
    b.textContent = t(on ? 'neiPreferiti' : 'aggiungiPreferiti');
    msg.hidden = true;
  });

  // --- Router ---
  async function vai() {
    const parti = (location.hash.replace(/^#\/?/, '') || '').split('/');
    try {
      if (parti[0] === 'nidi') await nidi();
      else if (parti[0] === 'fascia' && parti[1]) await fascia(parti[1]);
      else if (parti[0] === 'menu' && /^\d+$/.test(parti[1] || '')) {
        await settimana(Number(parti[1]), /^\d{4}-\d{2}-\d{2}$/.test(parti[2] || '') ? parti[2] : null);
      } else await home();
    } catch (e) {
      mostra('<p class="vuoto">' + esc(t('erroreMenuTutti')) + '</p>');
    }
  }
  window.addEventListener('hashchange', vai);

  // La schermata di avvio resta almeno 2,5 secondi e si chiude quando la prima vista è pronta.
  const avvio = document.getElementById('avvio');
  const inizio = Date.now();
  function chiudiAvvio() {
    if (!avvio || avvio.classList.contains('chiuso')) return;
    avvio.classList.add('chiuso');
    setTimeout(() => avvio.remove(), 400);
  }
  vai().finally(() => setTimeout(chiudiAvvio, Math.max(0, 2500 - (Date.now() - inizio))));
  setTimeout(chiudiAvvio, 6000);

  // Chiede al sito di aggiornare i menu, se è passato abbastanza tempo dall'ultima volta.
  // La risposta non serve: il sito decide da solo se scaricare i calendari.
  fetch(API + '/aggiorna', { method: 'POST' }).catch(() => {});

  // Installazione (Android e Chrome): il pulsante in fondo alla pagina compare solo se il browser
  // permette di installare l'app e se non è già installata.
  // Statistiche (GoatCounter): eventi anonimi sull'installazione. Se lo script non è caricato (offline, blocco pubblicità) non fa nulla.
  const conta = (nome) => { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'buonapp-' + nome, title: 'buonapp: ' + nome, event: true }); } catch (e) {} };
  let richiestaInstallazione = null;
  const installa = document.getElementById('installa');
  window.addEventListener('beforeinstallprompt', (ev) => {
    ev.preventDefault();
    richiestaInstallazione = ev;
    installa.hidden = false;
  });
  installa.addEventListener('click', async () => {
    if (!richiestaInstallazione) return;
    conta('installa-clic');
    richiestaInstallazione.prompt();
    const scelta = await richiestaInstallazione.userChoice.catch(() => null);
    if (scelta && scelta.outcome === 'dismissed') conta('installa-rifiutata');
    richiestaInstallazione = null;
    installa.hidden = true;
  });
  window.addEventListener('appinstalled', () => { installa.hidden = true; conta('installata'); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
