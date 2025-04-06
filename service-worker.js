const cacheName = 'lista-compras-v2';

const arquivosParaCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './imagens/logoCompra192.png',
  './imagens/logoCompra512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName) // Aqui usamos a variável corretamente
      .then(cache => cache.addAll(arquivosParaCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resposta => resposta || fetch(event.request))
  );
});
