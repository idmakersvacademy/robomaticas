# Auditoria de Numeronautas

## Alcance

Se reviso el proyecto como frontend estatico de produccion: HTML, CSS, JavaScript puro, progreso local, navegacion, sonidos, patrones de XSS, estabilidad y despliegue.

## Hallazgos principales

- El progreso en `localStorage` confiaba demasiado en datos guardados.
- Era posible escribir datos corruptos o exagerados en `localStorage` y dejar el juego en estados no esperados.
- El acceso a niveles no se validaba de nuevo al iniciar una escena desde codigo.
- Las respuestas del mapa principal podian recibir clicks repetidos durante ventanas cortas.
- Los sonidos no tenian lista permitida ni control antispam.
- El menu de niveles construia tarjetas con HTML interpolado.
- Tablas Galacticas aceptaba progreso guardado sin normalizar.

## Cambios realizados

- `js/nucleo/estado.js`
  - Agregadas funciones de sanitizacion de progreso.
  - Progreso corrupto vuelve a estado seguro.
  - Desbloqueo se limita a lo ganado por estrellas validas.
  - `saveProgress()` ahora valida antes de persistir y tolera bloqueo de `localStorage`.
  - Agregado `canAccessLevel(index)`.

- `js/nucleo/aventura.js`
  - `renderLevels()` ahora crea nodos con `createElement` y `textContent`.
  - `showConcept()` y `startLevel()` validan acceso antes de continuar.
  - Las preguntas del mapa usan bloqueo temporal para evitar multiples respuestas simultaneas.

- `js/nucleo/compartido.js`
  - Sonidos integrados desde `assets/sounds`.
  - Agregada lista permitida de sonidos.
  - Agregado cooldown para evitar multiples audios por spam.
  - Manejo seguro si el archivo no existe o el navegador bloquea audio.

- `js/niveles/tablas-galacticas.js`
  - Progreso de tablas sanitizado.
  - Solo se aceptan tablas y factores 1 a 9.
  - Una tabla completada solo queda marcada si tiene sus 9 practicas validas.
  - Guardado local envuelto en `try/catch`.

- Documentacion
  - Creado `SECURITY.md`.
  - Creado `DEPLOYMENT.md`.
  - Creado `AUDIT_REPORT.md`.

## XSS

No se encontraron `eval`, `new Function` ni `document.write`.

Se redujo el uso de HTML interpolado en una zona de navegacion importante. Siguen existiendo usos de `innerHTML` para renderizar estructuras visuales internas: maquinas, SVG, criaturas, baterias y particulas. Esos datos no vienen de inputs del usuario. No deben conectarse a contenido externo sin convertirlos primero a DOM seguro o sanitizarlos.

## localStorage

El progreso ahora:

- Se valida por forma.
- Se limita por rango.
- Descarta estrellas invalidas.
- Descarta niveles fuera del rango real.
- Tolera corrupcion y bloqueo del almacenamiento.

Limitacion: sin servidor, no existe proteccion absoluta contra usuarios avanzados que controlan consola y almacenamiento local. Para una empresa que necesite progreso inviolable se recomienda backend o firma criptografica generada fuera del cliente.

## Produccion

El proyecto queda listo para despliegue estatico con cabeceras seguras recomendadas. No se agregaron frameworks ni dependencias.

## Recomendaciones siguientes

- Convertir gradualmente los `innerHTML` visuales restantes a constructores DOM cuando se toquen esos modulos.
- Agregar pruebas manuales por nivel antes de cada publicacion.
- Versionar archivos si se activa cache agresivo.
- Si el juego guardara datos de ninos, agregar backend, privacidad formal y flujo de consentimiento correspondiente.
