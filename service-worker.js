const CACHE='caderno-espanhol-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('caderno-espanhol-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// página: tenta a rede primeiro (pega atualizações) e usa o cache sem internet
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{
      if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c)).catch(()=>{});}
      return r;
    }).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
