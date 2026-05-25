# Seguridad de RoboMaticas

## Estado actual

RoboMaticas es un juego frontend estatico hecho con HTML, CSS y JavaScript puro. No guarda datos sensibles, no usa autenticacion y no se conecta a APIs externas. El riesgo principal esta en manipulacion del cliente, corrupcion de `localStorage`, abuso de clicks/sonidos y uso accidental de HTML dinamico inseguro.

## Cambios aplicados

- El progreso principal ahora se sanitiza al cargar y al guardar.
- Los niveles desbloqueados se recalculan a partir de estrellas validas y se limitan al rango real del juego.
- Si `localStorage` esta corrupto o bloqueado por el navegador, el juego vuelve a un estado seguro sin romper la experiencia.
- Se agrego validacion de acceso antes de mostrar conceptos o iniciar niveles.
- Las respuestas del mapa principal tienen bloqueo temporal para evitar multiples envios simultaneos.
- Los sonidos usan una lista permitida y cooldown corto para evitar spam de audio.
- El menu de niveles dejo de construir tarjetas con HTML interpolado y ahora usa nodos DOM seguros.
- El progreso de Tablas Galacticas se normaliza y descarta valores fuera de rango.

## Riesgos encontrados

- Un frontend estatico no puede impedir por completo que alguien avanzado manipule progreso desde consola o `localStorage`. Para proteccion real de progreso empresarial se necesita backend, firma de progreso o cuenta de usuario.
- Todavia existen usos de `innerHTML` en componentes visuales internos que generan SVG, baterias, criaturas, maquinas y particulas. Actualmente no reciben entrada del usuario; no deben conectarse a datos externos sin sanitizacion previa.
- El proyecto usa `localStorage` solo para progreso. No guardar nombres, edades, correos, identificadores escolares ni datos sensibles de ninos.
- La reproduccion de audio depende de interaccion del usuario por politicas normales del navegador.

## Reglas para futuras modificaciones

- No usar `eval`, `new Function`, `document.write` ni handlers inline como `onclick`.
- Preferir `textContent`, `createElement`, `appendChild` y `replaceChildren`.
- Si se agrega texto editable por el jugador, normalizarlo, limitar longitud y nunca insertarlo con `innerHTML`.
- Si se cargan recursos externos, revisar permisos, origen y politica CSP.
- Mantener el progreso como dato no sensible y siempre pasarlo por funciones de sanitizacion.
- Todo enlace externo debe usar `rel="noopener noreferrer"` y, si abre nueva pestana, `target="_blank"`.

## Cabeceras recomendadas

Para produccion, configurar estas cabeceras en el hosting:

```txt
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'none'; upgrade-insecure-requests
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

Nota: si se endurece `style-src` sin permitir estilos inline, hay que mover los estilos dinamicos actuales a clases CSS o variables definidas en hojas de estilo.
