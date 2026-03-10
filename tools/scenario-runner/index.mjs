function nextRandom(state) {
  let value = state >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function runScenario(seed, ticks) {
  let state = seed >>> 0;
  const outputs = [];

  for (let tick = 1; tick <= ticks; tick += 1) {
    state = nextRandom(state);
    const roll = state / 4294967295;

    outputs.push({
      tick,
      rainfallDelta: Number((roll * 0.4 - 0.2).toFixed(4)),
      marketDrift: Number((roll * 0.1 - 0.05).toFixed(4))
    });
  }

  return outputs;
}

const seed = 42;
const ticks = 12;
const result = runScenario(seed, ticks);

console.log(JSON.stringify({ seed, ticks, result }, null, 2));