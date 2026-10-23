/* Growzphy service worker. Network first, so updates arrive as soon as you are online; cache is only the offline fallback. */
var C='growzphy-v1';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','favicon.png','LICENSE'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){})}))}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r&&r.ok&&r.type==='basic'){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp)})}
    return r;
  }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('index.html')})}));
});
