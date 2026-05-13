function createFactoryMultiplicationQuestion() {
  const tier = factory.machineIndex + 1;
  const low = tier <= 2 ? 2 : 4;
  const high = Math.min(12, 4 + tier * 2);
  const groups = rand(low, high);
  const clones = rand(2, high);
  const answer = groups * clones;
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
    options: makeOptions(answer),
  };
}
