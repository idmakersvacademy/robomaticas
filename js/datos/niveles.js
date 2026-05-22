const STORAGE_KEY = "robomaticas_robo";

const baseMap = [
  "##########",
  "#P..D.C.G#",
  "#.##.##..#",
  "#..C...#.#",
  "##.###E..#",
  "#..E..D..#",
  "#...##...#",
  "##########",
];

const maps = [baseMap];

const levels = [
  {
    id: 1,
    title: "Bahia de Sumas",
    type: "add",
    icon: "+",
    intro: "Acompana a Robo a cargar la Bahia de Sumas conectando baterias.",
    label: "Mision de sumas",
    task: "Junta cantidades",
    concept: {
      title: "Sumar es cargar el nucleo",
      intro: "En Bahia de Sumas, Robo conecta dos grupos de baterias. Al juntarlas, el nucleo recibe una sola carga total.",
      note: "Ejemplo: 2 baterias + 3 baterias = 5 baterias conectadas al nucleo.",
      demo: [
        ["batteries", 2],
        ["symbol", "+"],
        ["batteries", 3],
        ["symbol", "="],
        ["batteryTotal", 5],
      ],
    },
  },
  {
    id: 2,
    title: "Operacion Resta",
    type: "subtract",
    icon: "-",
    intro: "Robo entra a Operacion Resta, una arena futurista donde cada respuesta correcta dispara un ataque brillante.",
    label: "Mision de restas",
    task: "Derrota con restas",
    concept: {
      title: "Restar es quitar energia",
      intro: "En la arena, Robo empieza con una cantidad de carga y gasta una parte al atacar.",
      note: "Ejemplo: Robo tenia 9 cargas. Uso 4 en un laser. Le quedaron 5 cargas.",
      demo: [
        ["battleDots", 9, 4, "9"],
        ["symbol", "-"],
        ["used", 4, "4"],
        ["symbol", "="],
        ["battleDots", 5, 0, "5"],
      ],
    },
  },
  {
    id: 3,
    title: "Planeta Clonix",
    type: "multiply",
    icon: "x",
    intro: "Acompana a Robo a restaurar un laboratorio futurista creando clones con multiplicaciones.",
    label: "Mision de multiplicacion",
    task: "Crea clones",
    concept: {
      title: "Multiplicar es crear grupos iguales",
      intro: "En Planeta Clonix, cada portal crea la misma cantidad de criaturas. Multiplicar cuenta todos los clones juntos.",
      note: "Ejemplo: 3 portales crean 4 clones cada uno. 3 x 4 = 12 clones.",
      demo: [
        ["total", "3"],
        ["symbol", "x"],
        ["total", "4"],
        ["symbol", "="],
        ["total", "12"],
      ],
    },
  },
  {
    id: 4,
    title: "Central Energetica",
    type: "divide",
    icon: "/",
    intro: "Ayuda a Robo a estabilizar una central futurista repartiendo nucleos de energia entre reactores.",
    label: "Mision de division",
    task: "Activa reactores",
    concept: {
      title: "Dividir es repartir energia",
      intro: "La Central Energetica toma un grupo de nucleos y los reparte por igual entre reactores.",
      note: "Ejemplo: 24 nucleos / 6 reactores = 4 nucleos para cada reactor.",
      demo: [
        ["total", "24"],
        ["symbol", "/"],
        ["total", "6"],
        ["symbol", "="],
        ["total", "4"],
      ],
    },
  },
];

const conceptByType = {
  add: {
    title: "Sumar es cargar el nucleo",
    intro: "Cuando sumamos, conectamos dos grupos de baterias para formar una sola carga total.",
    note: "Ejemplo: 2 baterias + 3 baterias = 5 baterias conectadas al nucleo.",
    demo: [
      ["batteries", 2],
      ["symbol", "+"],
      ["batteries", 3],
      ["symbol", "="],
      ["batteryTotal", 5],
    ],
  },
  subtract: {
    title: "Restar es quitar y contar lo que queda",
    intro: "Cuando restamos, empezamos con una cantidad. Luego quitamos, usamos o perdemos una parte. El resultado nos dice cuanto queda.",
    note: "Ejemplo: Robo tenia 9 cargas. Uso 4 cargas en su ataque. Le quedaron 5 cargas.",
    demo: [
      ["battleDots", 9, 4, "9"],
      ["symbol", "-"],
      ["used", 4, "4"],
      ["symbol", "="],
      ["battleDots", 5, 0, "5"],
    ],
  },
  multiply: {
    title: "Multiplicar es crear grupos iguales",
    intro: "En el laboratorio, Robo usa la multiplicacion para crear varios grupos iguales de clones.",
    note: "Ejemplo: 3 capsulas crean 4 clones cada una. 3 x 4 = 12 clones.",
    demo: [
      ["total", "3"],
      ["symbol", "x"],
      ["total", "4"],
      ["symbol", "="],
      ["total", "12"],
    ],
  },
  divide: {
    title: "Dividir es repartir",
    intro: "Cuando dividimos, repartimos una cantidad en partes iguales.",
    note: "Ejemplo: 12 baterias / 3 estaciones = 4 baterias por estacion.",
    demo: [
      ["total", "12"],
      ["symbol", "/"],
      ["total", "3"],
      ["symbol", "="],
      ["total", "4"],
    ],
  },
};
