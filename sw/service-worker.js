var app="MediaCloud --v1";
var appFiles=[
  "javascript/animation.js",
  "javascript/jquery.min.js",
  "javascript/bootstrap.js",
  "javascript/bootstrap.min.js",
  "javascript/intersectionobserver-polyfill.js",
  "javascript/jquery-slim.min.js",
  "javascript/jquery.keyframes.min.js",
  "javascript/modernizr.js",
  "javascript/scroller.js",
  "javascript/shaka-player.compiled.js",
  "javascript/StackBlur.js",
  "javascript/sticky.js",
  "javascript/video-player.js",
  "javascript/wavesurfer.js",
  "css/animation.css",
  "css/app_style_max.css",
  "css/app_style_min.css",
  "css/bootstrap-theme.css",
  "css/bootstrap-theme.css.map",
  "css/bootstrap-theme.min.css.map",
  "css/bootstrap.css",
  "css/bootstrap.min.css",
  "css/bootstrap.min.css.map",
  "/404"
];
self.addEventListener("install",function(e){
  console.log("Service Worker installed");
  e.waitUntil(
      caches.open(app).then(function(cache){
          console.log("Service worker caching files");
          return cache.addAll(appFiles);
      })
  )
});

self.addEventListener('activate',function(e){
  console.log("Service Worker Activated");
  e.waitUntil(
    caches.keys().then(function(cacheName){
        return Promise.all(cacheName.map(function(cachedName){
          if(cachedName!==app){
            console.log("[ServiceWorker] Removing Cache Files from cache");
            return caches.delete(cachedName);
          }
        }))
    })
  )
});

self.addEventListener('fetch', function(event) {
  var requestURL=new URL(event.request.url);
/*
var condition = navigator.onLine ? "online" : "offline";
if(condition=="offline"){

}
*/
  if (requestURL.origin == location.origin){
      if(/\.jpg/.test(requestURL.pathname) || /\.png/.test(requestURL.pathname) || /\.gif/.test(requestURL.pathname)){
        event.respondWith(
          caches.open(app).then(function(cache) {
            return cache.match(event.request).then(function (response) {
              return response || fetch(event.request).then(function(response) {
                if(response){
                  cache.put(event.request, response.clone());
                }
                return response;
              });
            });
          })
        );
        return;
      }
      if (event.request.headers.get('range')) {
        var pos =
        Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
        console.log('Range request for', event.request.url,
          ', starting position:', pos);
        event.respondWith(
          caches.open(app)
          .then(function(cache) {
            return cache.match(event.request.url);
          }).then(function(res) {
            if (!res) {
              return fetch(event.request)
              .then(res => {
                return res.arrayBuffer();
              });
            }
            return res.arrayBuffer();
          }).then(function(ab) {
            return new Response(
              ab.slice(pos),
              {
                status: 206,
                statusText: 'Partial Content',
                headers: [
                  // ['Content-Type', 'video/webm'],
                  ['Content-Range', 'bytes ' + pos + '-' +
                    (ab.byteLength - 1) + '/' + ab.byteLength]]
              });
          }));
      } else {
        console.log('Non-range request for', event.request.url);
        event.respondWith(
          // caches.match() will look for a cache entry in all of the caches available to the service worker.
          // It's an alternative to first opening a specific named cache and then matching on that.
          caches.match(event.request).then(function(response) {
          if (response) {
            console.log('Found response in cache:', response);
            return response;
          }
          console.log('No response found in cache. About to fetch from network...');
          // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
          // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
          return fetch(event.request).then(function(response) {
            console.log('Response from network is:', response);

            return response;
          }).catch(function(error) {
            // This catch() will handle exceptions thrown from the fetch() operation.
            // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
            // It will return a normal response object that has the appropriate error code set.
            console.error('Fetching failed:', error);

            throw error;
          });
        })
        );
      }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
    })
  );
});
