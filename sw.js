const V="carbug-v4",A=["./","index.html","css/style.css","js/app.js","data/faults.js","data/lights.js","manifest.webmanifest","assets/icons/icon-192.png","assets/icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x))))));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||!e.request.url.startsWith("http")||e.request.headers.has("range"))return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c)).catch(()=>{});return r}).catch(()=>caches.match(e.request)));
});
