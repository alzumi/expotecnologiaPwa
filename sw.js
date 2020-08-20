importScripts('js/sw-utils.js');

const PRINCIPAL_CACHE = 'principal-v1';
const DINAMICO_CACHE = 'dinamico-v1';
const INALTERABLE_CACHE = 'inalterable-v1';

// APP_SHELL = variable que guarda todos los archivos
// que yo crear y agrege para que mi app funciones
const APP_SHELL = [
    // '/',
    '/index.html',
    'js/app.js',
    'img/tecexpo1.png',
    '/img/1.png',
    '/img/2.png',
    '/img/3.png',
    '/img/4.png',
    '/img/5.png',
    '/img/6.png',
    '/img/favicon-2560.png',
    '/img/favicon-2048.png',
    '/img/favicon-1536.png',
    '/img/favicon-1408.png',
    '/img/favicon-1024.png',
    '/img/favicon-512.png',
    '/img/favicon-384.png',
    '/img/favicon-256.png',
    '/img/favicon-192.png',
    '/img/favicon-128.png',
    '/img/favicon-96.png',
    '/img/favicon-64.png',
    '/img/favicon-32.png',
    '/img/favicon-16.png',
    '/img/favicon.png',
    '/img/facebook.png',
    '/img/instagram.png',
    '/img/twitter.png',
    '/img/bars-solid.svg',
    '/img/businessman.png',
    '/img/man-reading.png',
    '/img/professional-presenting-a-report.png',
    '/img/pwa.jpg',
    'js/sw-utils.js'

]

// aqui guardare los archivos de tercero,
// los cuales ya tienen una estructura de codigo que no se modificara
const APP_INALTERABLE = [
    'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
    'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;1,600&display=swap'
];


// evento de la instalacion del Service Worker
self.addEventListener('install', e => {


    // creamos el cache y le damos nombre
    const cacheprincipal = caches.open(PRINCIPAL_CACHE)
        .then(cache => cache.addAll(APP_SHELL));


    const cacheInalterable = caches.open(INALTERABLE_CACHE)
        .then(cache => cache.addAll(APP_INALTERABLE));

    e.waitUntil(Promise.all([cacheprincipal, cacheInalterable]));

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            //  si la version que se encuentra activa es la misma
            // que se encuentra aqui- no hacer nada
            // si la version es diferente - borra la activa y
            // instala la que esta aqui
            if (key !== PRINCIPAL_CACHE && key.includes('principal')) {

                return caches.delete(key);
            }

        });

    });

    e.waitUntil(respuesta);
});


self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then(res => {

        // si existe el archivo en el cache el cual estoy consultando        
        if (res) {

            // regresa la consulta
            return res;

        } else {
            // sino existe
            // haga la consulta en la web
            return fetch(e.request).then(newRes => {

                return actualizarCacheDinamico(DINAMICO_CACHE, e.request, newRes);

            });
        }

    });

    e.respondWith(respuesta);
});