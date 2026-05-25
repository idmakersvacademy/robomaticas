function createFactoryMultiplicationQuestion() {
  const tier = factory.machineIndex + 1;
  const operation = generarMultiplicacion(Math.min(3, tier));
  const groups = operation.a;
  const clones = operation.b;
  const answer = operation.respuesta;
  const scenarios = [
    `${groups} portales crean ${clones} criaturas cada uno.`,
    `${groups} orbitas despiertan ${clones} clones cada una.`,
    `${groups} jardines generan ${clones} criaturas cada uno.`,
    `${groups} zonas de Clonix reciben ${clones} criaturas cada una.`,
  ];
  const brief = randomFrom(scenarios);
  return {
    text: `${groups} x ${clones} = ?`,
    brief,
    equation: `${groups} x ${clones} = ?`,
    equationMarkup: `
      <span class="multiply-factor">${groups}</span>
      <span class="multiply-symbol">x</span>
      <span class="multiply-factor">${clones}</span>
      <span class="multiply-symbol">=</span>
      <span class="multiply-result">?</span>
    `,
    groups,
    items: clones,
    groupLabel: "Portal",
    answer,
    options: generarOpciones(answer, 4),
  };
}
