if (!self.define) {
  let e,
    s = {};
  const n = (n, c) => (
    (n = new URL(n + '.js', c).href),
    s[n] ||
      new Promise(s => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, t) => {
    const a = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[a]) return;
    let i = {};
    const r = e => n(e, a),
      o = { module: { uri: a }, exports: i, require: r };
    s[a] = Promise.all(c.map(e => o[e] || r(e))).then(e => (t(...e), i));
  };
}
define(['./workbox-07a7b4f2'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'b4a96c5cb569344332a89b561890f703' },
        { url: '/_next/static/W7otC6l_9n-4r4cZGncPP/_buildManifest.js', revision: '8f7646b79606f8231e1a2a8561bce1d1' },
        { url: '/_next/static/W7otC6l_9n-4r4cZGncPP/_ssgManifest.js', revision: 'b6652df95db52feb4daf4eca35380933' },
        { url: '/_next/static/chunks/218.6ff53b6c2fad06e8.js', revision: '6ff53b6c2fad06e8' },
        { url: '/_next/static/chunks/28-35a89ad715e39043.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/32-15326e08a940d68e.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/342-faa8d3e50141632d.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/441-4e5f0fd8581aa250.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/456-0ac6ad2763f94ab4.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/464-04ec976d463acb62.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/504-c47236e2a75103bc.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/515-668b9447e18f3a04.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/602-c0a6127961dacf0a.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/650-4efbb0145052348c.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/713-2f37929110ba9463.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/722-edd75e2e124a273e.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/839-a4edb8be01bef5e1.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/847-e6e08e3caf8fab61.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/870fdd6f-9d93d7bdd1b7b6ca.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/992.31c88ab723d75629.js', revision: '31c88ab723d75629' },
        { url: '/_next/static/chunks/app/_not-found-e5577c3b4e18cf66.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/app/csr/page-77b968fa61d5a137.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/app/dashboard/page-572493799d22d946.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/app/layout-3758e72615c7daa6.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/app/page-88ab78a1be189110.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/app/profile/page-296e6262d09a3456.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/app/ssr/page-cb071509c46f180d.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        {
          url: '/_next/static/chunks/app/task-lists/%5BtaskListId%5D/page-81e6296bc5b1f593.js',
          revision: 'W7otC6l_9n-4r4cZGncPP'
        },
        {
          url: '/_next/static/chunks/app/task/%5BtaskId%5D/page-db71c68ffd7da4b5.js',
          revision: 'W7otC6l_9n-4r4cZGncPP'
        },
        { url: '/_next/static/chunks/fd9d1056-79e78435d29d505e.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/framework-43665103d101a22d.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/main-2d430b964eeacd81.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/main-app-ad0e146cb5d5b1d1.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/pages/_app-8eb16304a942c55e.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/pages/_error-e2ecc85f0827d4c2.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js', revision: '837c0df77fd5009c9e46d446188ecfd0' },
        { url: '/_next/static/chunks/webpack-b93f43895aa4bc1b.js', revision: 'W7otC6l_9n-4r4cZGncPP' },
        { url: '/_next/static/css/46109fd438c24886.css', revision: '46109fd438c24886' },
        { url: '/_next/static/css/66e52f93c8801261.css', revision: '66e52f93c8801261' },
        { url: '/_next/static/css/fec95abf28dff384.css', revision: 'fec95abf28dff384' },
        { url: '/_next/static/media/logo.9d6a7e80.webp', revision: '2d949a2e509bedd4320ebc8a867df7db' },
        { url: '/favicon.ico', revision: '2d949a2e509bedd4320ebc8a867df7db' },
        { url: '/logo-192x192.png', revision: '9bc65220ecac1017385f09fc773af2de' },
        { url: '/logo-192x192.webp', revision: '5b337d99a8a4c054023a118df697ebcf' },
        { url: '/logo-512x512.png', revision: 'f3c4b3e2d94a9f33eec466f654ed35ad' },
        { url: '/logo-512x512.webp', revision: '408d6c015dd17be11e2d7df1fb94c1b4' },
        { url: '/logo.webp', revision: '2d949a2e509bedd4320ebc8a867df7db' },
        { url: '/manifest.json', revision: '1a319a79f1dc1bbe093f99279ff5598f' },
        { url: '/screenshots/screenshot-desktop.png', revision: '8072ca8d6b6a9d0cb36250fd1ad4bb9e' },
        { url: '/screenshots/screenshot-mobile.png', revision: 'a1fe441b9844aeed04d936af84d75d01' }
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: n, state: c }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s
          }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })]
      }),
      'GET'
    );
});
