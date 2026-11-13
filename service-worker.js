const CACHE = "po-to-excel-v6";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  const sameOrigin = url.origin === location.origin;
  const cdn = url.hostname === "cdnjs.cloudflare.com";
  if (!sameOrigin && !cdn) return;               // relay, NetSuite etc. go straight to the network
  if (sameOrigin) {
    // app files: network first (so updates show immediately), cache only when offline
    e.respondWith(fetch(req, {cache: "no-cache"}).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); }
      return r;
    }).catch(() => caches.match(req, {ignoreSearch: true})));
    return;
  }
  // libraries from cdnjs: cache first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); }
    return r;
  })));
});
