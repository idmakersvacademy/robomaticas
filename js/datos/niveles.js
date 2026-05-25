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
      title: "Mision: cargar el nucleo",
      intro: "Robo necesita unir dos paquetes de energia para encender la bahia.",
      note: "Tiene 2 baterias azules y recibe 3 mas. 2 + 3 = 5 baterias para el nucleo.",
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
      title: "Mision: energia que queda",
      intro: "Robo tiene 18 baterias para reparar la estacion. Uso 7 baterias en los drones.",
      note: "Operacion real: 18 - 7 = 11. Quedan 11 baterias para seguir la mision.",
      demo: [
        ["battleDots", 18, 7, "18"],
        ["symbol", "-"],
        ["used", 7, "7"],
        ["symbol", "="],
        ["battleDots", 11, 0, "11"],
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
      title: "Mision: duplicar criaturas",
      intro: "Cada portal de Clonix crea el mismo grupo de criaturas. Robo calcula el total antes de activar la maquina.",
      note: "3 portales crean 4 clones cada uno. 3 x 4 = 12 clones.",
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
      title: "Mision: equilibrar reactores",
      intro: "La central solo funciona si todos los reactores reciben la misma cantidad de nucleos.",
      note: "24 nucleos / 6 reactores = 4 nucleos para cada reactor.",
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
    title: "Mision: energia que queda",
    intro: "Robo tiene 18 baterias para reparar la estacion. Uso 7 baterias en los drones.",
    note: "Operacion real: 18 - 7 = 11. Quedan 11 baterias para seguir la mision.",
    demo: [
      ["battleDots", 18, 7, "18"],
      ["symbol", "-"],
      ["used", 7, "7"],
      ["symbol", "="],
      ["battleDots", 11, 0, "11"],
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
