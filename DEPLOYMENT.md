# Despliegue de RoboMaticas

RoboMaticas es un sitio estatico. No requiere build, framework ni servidor especial. El archivo de entrada es `index.html`.

## Estructura actual

```txt
/
├── index.html
├── style.css
├── script.js
├── css/
├── js/
│   ├── datos/
│   ├── niveles/
│   └── nucleo/
└── assets/
    └── sounds/
```

La estructura ya separa estilos, datos de niveles, logica central, niveles y sonidos. Para evitar romper rutas de produccion, no se movieron archivos de forma agresiva. Si se hace una reorganizacion mayor despues, debe hacerse con una pasada completa de pruebas visuales.

## Cloudflare Pages

1. Subir el repositorio a GitHub.
2. Crear un proyecto en Cloudflare Pages.
3. Framework preset: `None`.
4. Build command: dejar vacio.
5. Output directory: `/`.
6. Agregar las cabeceras seguras desde la seccion de headers.

## Netlify

1. New site from Git.
2. Build command: dejar vacio.
3. Publish directory: `.`.
4. Crear archivo `_headers` o configurar cabeceras desde Netlify.

## Vercel

1. Importar repositorio.
2. Framework preset: `Other`.
3. Build command: dejar vacio.
4. Output directory: dejar vacio o `.`.
5. Usar `vercel.json` si se quieren cabeceras personalizadas.

## Hosting propio

1. Copiar todos los archivos del proyecto al directorio publico del servidor.
2. Servir como archivos estaticos con Nginx, Apache o similar.
3. Activar HTTPS.
4. Configurar cache para CSS, JS, imagenes y audio.
5. No exponer archivos temporales, backups ni configuraciones privadas.

## WordPress con subdominio

Recomendado para no mezclar el juego con plugins de WordPress:

1. Crear subdominio, por ejemplo `juego.tudominio.com`.
2. Apuntar el subdominio a Cloudflare Pages, Netlify, Vercel o hosting estatico.
3. En WordPress agregar un boton/enlace hacia el subdominio.
4. Evitar incrustarlo en un iframe si no es necesario.

## Cabeceras HTTP sugeridas

```txt
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'none'; upgrade-insecure-requests
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

## Cache recomendado

```txt
index.html: no-cache
css/*: public, max-age=31536000, immutable
js/*: public, max-age=31536000, immutable
assets/*: public, max-age=31536000, immutable
```

Si se usa cache largo, versionar archivos o cambiar nombres cuando se publiquen cambios.

## Checklist antes de publicar

- Abrir `index.html` en navegador moderno.
- Probar niveles 1 al 8 en desktop y movil.
- Probar sonidos con interaccion real del usuario.
- Borrar `localStorage` y verificar que el progreso inicia estable.
- Manipular `localStorage` manualmente y confirmar que el juego no se rompe.
- Revisar consola del navegador sin errores.
