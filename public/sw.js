
const CACHE = "contabileasy-v1";

const PRECACHE = [
  "/",
  "/index.html",
];


self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});


self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});


self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);


  if (!url.protocol.startsWith("http")) return;
  if (url.hostname.includes("firestore") ||
      url.hostname.includes("firebase") ||
      url.hostname.includes("googleapis") ||
      url.hostname.includes("dicebear")) return;


  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (request.destination === "script" ||
      request.destination === "style"  ||
      request.destination === "image"  ||
      request.destination === "font") {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }
});