// Gerado por build/pwa.ps1
const CACHE = 'calc-notas-BC68571FCF85';
const ARQUIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icones/icone-192.png', 'icones/icone-512.png', 'icones/icone-maskable-512.png', 'icones/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys()
        .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
        .then(() => self.clients.claim()));
});

// Rede primeiro (pega a versão mais nova); sem internet, usa o que está guardado
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .then((resp) => {
                if (resp.ok && new URL(e.request.url).origin === location.origin) {
                    const copia = resp.clone();
                    caches.open(CACHE).then((c) => c.put(e.request, copia));
                }
                return resp;
            })
            .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
    );
});