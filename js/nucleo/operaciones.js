function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mezclarOpciones(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function generarSuma(dificultad = 1) {
  const max = dificultad === 1 ? 20 : dificultad === 2 ? 50 : 100;
  const a = enteroAleatorio(1, max);
  const b = enteroAleatorio(1, max);
  return { a, b, texto: `${a} + ${b}`, respuesta: a + b };
}

function generarResta(dificultad = 1) {
  const max = dificultad === 1 ? 20 : dificultad === 2 ? 50 : 100;
  let a = enteroAleatorio(1, max);
  let b = enteroAleatorio(1, max);
  if (b > a) [a, b] = [b, a];
  return { a, b, texto: `${a} - ${b}`, respuesta: a - b };
}

function generarMultiplicacion(dificultad = 1) {
  const max = dificultad === 1 ? 6 : dificultad === 2 ? 9 : 12;
  const a = enteroAleatorio(2, max);
  const b = enteroAleatorio(2, max);
  return { a, b, texto: `${a} x ${b}`, respuesta: a * b };
}

function generarDivision(dificultad = 1) {
  const divisorMax = dificultad === 1 ? 6 : dificultad === 2 ? 9 : 12;
  const divisor = enteroAleatorio(2, divisorMax);
  const resultado = enteroAleatorio(2, divisorMax);
  const dividendo = divisor * resultado;
  return { a: dividendo, b: divisor, texto: `${dividendo} / ${divisor}`, respuesta: resultado };
}

function generarOpciones(respuestaCorrecta, cantidad = 4) {
  const opciones = new Set([respuestaCorrecta]);
  const base = Math.max(3, Math.ceil(Math.abs(respuestaCorrecta) / 4));

  while (opciones.size < cantidad) {
    const variacion = enteroAleatorio(-base - 6, base + 6);
    const falsa = respuestaCorrecta + (variacion || base);
    if (falsa >= 0 && falsa !== respuestaCorrecta) opciones.add(falsa);
  }

  return mezclarOpciones([...opciones]);
}
