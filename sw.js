// Service worker di buonApp: l'app si apre anche senza rete e mostra l'ultimo menu visto.
// Cambiare VERSIONE a ogni rilascio che modifica i file dell'interfaccia.
const VERSIONE = 'buonapp-v11';
const GUSCIO = [
  './',
  'index.html',
  'privacy.html',
  'css/app.css',
  'js/app.js',
  'manifest.webmanifest',
  'img/icona-192.png',
  'img/favicon-32.png',
  'img/padella-piatto.png',
  'font/BlackOpsOne.woff2',
  'font/EmilysCandy.woff2',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(VERSIONE).then((c) => c.addAll(GUSCIO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((chiavi) => Promise.all(chiavi.filter((k) => k !== VERSIONE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  if (req.url.includes('/api/v1/')) {
    // Menu: prima la rete, se manca si usa l'ultima risposta salvata.
    ev.respondWith(
      fetch(req)
        .then((r) => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(VERSIONE).then((c) => c.put(req, copia));
          }
          return r;
        })
        .catch(() => caches.match(req).then((r) => r || Response.error()))
    );
    return;
  }

  // Interfaccia: prima la cache, intanto si aggiorna in sottofondo.
  ev.respondWith(
    caches.match(req).then((inCache) => {
      const rete = fetch(req)
        .then((r) => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(VERSIONE).then((c) => c.put(req, copia));
          }
          return r;
        })
        .catch(() => inCache);
      return inCache || rete;
    })
  );
});
