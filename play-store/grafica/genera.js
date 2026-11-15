// Grafiche per la scheda di Google Play, in italiano, inglese, francese, spagnolo e arabo.
//
// Uso (dalla radice del repository, con Playwright e un font arabo installati):
//   node play-store/grafica/genera.js
//
// Serve l'app dalla cartella del repository e chiede i menu al sito vero
// (https://www.entratadisicurezza.com/buonapp/api/v1/...), poi produce:
//   play-store/grafica/icona-512.png                    icona dello store (una per tutte le lingue)
//   play-store/grafica/<lingua>/feature-1024x500.png    grafica in primo piano
//   play-store/grafica/<lingua>/telefono-0N.png         4 schermate 1080×1920
//   play-store/grafica/<lingua>/tablet-0N.png           2 schermate 1600×2560
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const RADICE = path.resolve(__dirname, '../..');
const USCITA = __dirname;
const SITO = 'https://www.entratadisicurezza.com';
const PORTA = 8799;
const LINGUE = ['it', 'en', 'fr', 'es', 'ar'];

// Settimana da mostrare nelle schermate e menu preferiti (id di /api/v1/menu).
const LUNEDI = process.env.LUNEDI || '2026-11-16';
const PREFERITI = [27, 21]; // primaria ordinario, infanzia senza carne
const MENU_SETTIMANA = 27;

const TESTI = {
  it: {
    slogan: 'Che si mangia oggi a scuola?',
    sotto: 'I menu delle scuole di Torino, dal nido alle medie',
    didascalie: [
      'Il pranzo di oggi, appena apri l’app',
      'Tutta la settimana, giorno per giorno',
      'Dal nido alle medie',
      'Tutte le diete, anche senza glutine',
    ],
  },
  en: {
    slogan: 'What’s for lunch at school today?',
    sotto: 'Turin school menus, from nursery to middle school',
    didascalie: [
      'Today’s lunch, as soon as you open the app',
      'The whole week, day by day',
      'From nursery to middle school',
      'Every diet, gluten-free included',
    ],
  },
  fr: {
    slogan: 'On mange quoi à l’école aujourd’hui ?',
    sotto: 'Les menus des écoles de Turin, de la crèche au collège',
    didascalie: [
      'Le déjeuner du jour dès l’ouverture',
      'Toute la semaine, jour après jour',
      'De la crèche au collège',
      'Tous les régimes, même sans gluten',
    ],
  },
  es: {
    slogan: '¿Qué se come hoy en el cole?',
    sotto: 'Los menús de los colegios de Turín, de la guardería a la secundaria',
    didascalie: [
      'La comida de hoy, nada más abrir la app',
      'Toda la semana, día a día',
      'De la guardería a la secundaria',
      'Todas las dietas, también sin gluten',
    ],
  },
  ar: {
    slogan: 'ماذا نأكل اليوم في المدرسة؟',
    sotto: 'قوائم طعام مدارس تورينو، من الحضانة إلى الإعدادية',
    didascalie: [
      'غداء اليوم فور فتح التطبيق',
      'الأسبوع كاملًا، يومًا بيوم',
      'من الحضانة إلى الإعدادية',
      'جميع الأنظمة الغذائية، ومنها الخالي من الغلوتين',
    ],
  },
};

// --- Server locale: file dal repository, API dal sito vero (con cache) ---
const TIPI = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
const cacheApi = {};
function avviaServer() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      const u = new URL(req.url, 'http://x');
      if (u.pathname.startsWith('/buonapp/api/')) {
        if (req.method !== 'GET') { res.writeHead(204); return res.end(); }
        const k = u.pathname + u.search;
        if (!cacheApi[k]) cacheApi[k] = execFileSync('curl', ['-s', '-m', '30', SITO + k]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(cacheApi[k]);
      }
      let p = u.pathname.replace(/^\/buonapp\//, '/');
      if (p === '/grafica-padella.png') p = '/img/padella-piatto.png';
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(RADICE, p);
      if (!f.startsWith(RADICE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      // CORS: le cornici sono pagine senza origine e caricano i font da qui.
      res.writeHead(200, { 'Content-Type': TIPI[path.extname(f)] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
      res.end(fs.readFileSync(f));
    });
    s.listen(PORTA, () => ok(s));
  });
}

const BASE = `http://localhost:${PORTA}/buonapp/`;
const fontUrl = (f) => `${BASE}font/${f}`;

// Stile comune delle cornici: colori e strisce dell'app.
function stile(lingua) {
  const rtl = lingua === 'ar';
  return `
  @font-face { font-family: "Black Ops One"; src: url(${fontUrl('BlackOpsOne.woff2')}); }
  @font-face { font-family: "Emilys Candy"; src: url(${fontUrl('EmilysCandy.woff2')}); }
  :root { --giallo:#fcbb21; --verde:#7c9b3d; --rosso:#b8292d; --acqua:#63bba2; --arancio:#eb8829; --scuro:#1f1d1a; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 100%; height: 100%; }
  body { background: var(--giallo); color: var(--scuro); overflow: hidden;
    font-family: ${rtl ? '"Noto Sans Arabic",' : ''} system-ui, "Segoe UI", Roboto, Arial, sans-serif; }
  .strisce { height: 100%; background: linear-gradient(90deg, var(--verde) 0 25%, var(--rosso) 25% 50%, var(--arancio) 50% 75%, var(--acqua) 75% 100%); }
  .logo { font-family: "Black Ops One", sans-serif; color: var(--rosso); line-height: 1; unicode-bidi: isolate; }
  .slogan { font-family: ${rtl ? '"Noto Sans Arabic", sans-serif; font-weight: 700' : '"Emilys Candy", sans-serif'}; line-height: 1.25; }
  `;
}

function htmlFeature(lingua) {
  const t = TESTI[lingua];
  const rtl = lingua === 'ar';
  return `<!doctype html><html lang="${lingua}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${stile(lingua)}
  body { display: flex; align-items: center; gap: 36px; padding: 0 64px 22px; }
  .padella { width: 360px; height: 360px; flex: none; }
  .testi { flex: 1; }
  .logo { font-size: 104px; }
  .slogan { font-size: ${rtl ? 44 : 46}px; margin-top: 18px; }
  .sotto { font-size: 26px; margin-top: 16px; color: #3d372f; ${rtl ? 'font-weight: 400;' : ''} }
  .fondo { position: absolute; inset: auto 0 0 0; height: 22px; }
  </style></head><body>
  <img class="padella" src="${BASE}grafica-padella.png" alt="">
  <div class="testi"><div class="logo">buonApp</div><div class="slogan">${t.slogan}</div><div class="sotto">${t.sotto}</div></div>
  <div class="fondo"><div class="strisce"></div></div>
  </body></html>`;
}

function htmlCornice(lingua, didascalia, immagine, larghezza, altezza) {
  const rtl = lingua === 'ar';
  const scala = larghezza / 1080;
  return `<!doctype html><html lang="${lingua}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${stile(lingua)}
  body { display: flex; flex-direction: column; align-items: center; }
  .alto { width: 100%; padding: ${70 * scala}px ${70 * scala}px ${40 * scala}px; text-align: center; }
  .logo { font-size: ${52 * scala}px; }
  h1 { font-size: ${rtl ? 64 * scala : 68 * scala}px; line-height: 1.2; margin-top: ${24 * scala}px; font-weight: 800; }
  .telefono { flex: 1; width: ${larghezza - 150 * scala}px; position: relative; margin-bottom: ${-40 * scala}px;
    border-radius: ${48 * scala}px ${48 * scala}px 0 0; border: ${14 * scala}px solid var(--scuro); border-bottom: 0;
    overflow: hidden; background: #fffaf0; box-shadow: 0 ${20 * scala}px ${60 * scala}px rgb(0 0 0 / .25); }
  .telefono img { width: 100%; display: block; }
  .fondo { width: 100%; height: ${26 * scala}px; position: relative; z-index: 2; }
  </style></head><body>
  <div class="alto"><div class="logo">buonApp</div><h1>${didascalia}</h1></div>
  <div class="telefono"><img src="data:image/png;base64,${immagine.toString('base64')}" alt=""></div>
  <div class="fondo"><div class="strisce"></div></div>
  </body></html>`;
}

// Schermate dell'app vera nella lingua richiesta.
async function catturaApp(browser, lingua, larghezza, altezza) {
  const ctx = await browser.newContext({
    viewport: { width: larghezza, height: altezza }, deviceScaleFactor: 2.5, locale: 'it-IT',
    timezoneId: 'Europe/Rome', serviceWorkers: 'block', colorScheme: 'light',
  });
  await ctx.route(/zgo\.at|goatcounter/, (r) => r.abort());
  // Oggi = domenica prima della settimana mostrata: la home mostra «Domani, lunedì …».
  const domenica = new Date(LUNEDI + 'T10:00:00+01:00');
  domenica.setDate(domenica.getDate() - 1);
  await ctx.addInitScript(`{
    const T = ${domenica.getTime()}; const D = Date;
    class F extends D { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } }
    Date = F;
  }`);
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  const vai = async (hash, attendi, preferiti) => {
    await p.goto(BASE + '?lang=' + lingua);
    await p.evaluate((v) => localStorage.setItem('buonapp.preferiti', JSON.stringify(v)), preferiti);
    await p.goto(BASE + '?lang=' + lingua + hash);
    await p.reload();
    await p.waitForSelector(attendi);
    await p.waitForTimeout(400);
    return p.screenshot();
  };
  const scatti = [
    await vai('#/', '.scheda', PREFERITI),
    await vai('#/menu/' + MENU_SETTIMANA + '/' + LUNEDI, '.settimana-nav', PREFERITI),
    await vai('#/', '.scelte', []),
    await vai('#/fascia/infanzia', '.scelte', []),
  ];
  if (errori.length) throw new Error(lingua + ': ' + errori.join(' | '));
  await ctx.close();
  return scatti;
}

async function rendi(browser, html, file, w, h) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: file, type: 'png', omitBackground: false });
  await p.close();
}

(async () => {
  const server = await avviaServer();
  const browser = await chromium.launch();
  try {
    // Icona: quella dell'app, quadrata e a piena superficie (Google aggiunge angoli e ombra).
    fs.copyFileSync(path.join(RADICE, 'img/icona-512.png'), path.join(USCITA, 'icona-512.png'));

    for (const lingua of LINGUE) {
      const dir = path.join(USCITA, lingua);
      fs.mkdirSync(dir, { recursive: true });
      await rendi(browser, htmlFeature(lingua), path.join(dir, 'feature-1024x500.png'), 1024, 500);

      const telefono = await catturaApp(browser, lingua, 412, 760);
      for (let i = 0; i < telefono.length; i++) {
        await rendi(browser, htmlCornice(lingua, TESTI[lingua].didascalie[i], telefono[i], 1080, 1920),
          path.join(dir, `telefono-0${i + 1}.png`), 1080, 1920);
      }
      const tablet = await catturaApp(browser, lingua, 600, 900);
      for (const i of [0, 1]) {
        await rendi(browser, htmlCornice(lingua, TESTI[lingua].didascalie[i], tablet[i], 1600, 2560),
          path.join(dir, `tablet-0${i + 1}.png`), 1600, 2560);
      }
      console.log('fatto', lingua);
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
