const CACHE = "po-to-excel-v4";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.hostname === "api.github.com") return;
  // data.json: network first, fall back to cache
  if (url.origin === location.origin && url.pathname.endsWith("/data.json")) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put("./data.json", c)); return r; })
      .catch(() => caches.match("./data.json")));
    return;
  }
  // everything else: cache first, then network (and cache libraries from CDN)
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(r => {
    if (r.ok && (url.origin === location.origin || url.hostname === "cdnjs.cloudflare.com")) {
      const c = r.clone(); caches.open(CACHE).then(ca => ca.put(req, c));
    }
    return r;
  })));
});
