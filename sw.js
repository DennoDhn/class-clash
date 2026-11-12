const CACHE='class-clash-1.1.0';
const DEV=self.location.hostname==='127.0.0.1'||self.location.hostname==='localhost';
const FILES=['./','./index.html','./style.css','./app.js','./engine.js','./legacy-engine.js','./render.js','./storage.js','./icon.svg','./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>DEV?self.skipWaiting():undefined));});
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('class-clash-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;if(DEV){event.respondWith(fetch(event.request));return;}
 event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request);if(cached)return cached;
 // Shared challenge URLs use the same cached shell, even offline.
 if(event.request.mode==='navigate'){const shell=await cache.match(new URL('./index.html',self.registration.scope).href);if(shell)return shell;}
 return fetch(event.request);}));});
