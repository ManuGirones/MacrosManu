const C="miplan-v38";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const req=e.request;
  const isDoc = req.mode==="navigate" || req.destination==="document";
  if(isDoc){
    // RED PRIMERO para el HTML: siempre la última versión si hay conexión
    e.respondWith(fetch(req).then(res=>{const cc=res.clone();caches.open(C).then(c=>c.put("./index.html",cc));return res;}).catch(()=>caches.match("./index.html")));
  } else {
    // caché primero para estáticos (iconos, manifest)
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cc=res.clone();caches.open(C).then(c=>c.put(req,cc));return res;}).catch(()=>r)));
  }
});
