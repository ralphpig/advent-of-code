const { readFileSync } = require('fs');

function memory() {
  const memory_used = process.memoryUsage();
  for (let key in memory_used) {
    console.log(
      `${key} ${Math.round((memory_used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
}

console.time('parse');
const input = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = '3,4,3,1,2';

  return input
    .trim()
    .split(',')
    .map((d) => parseInt(d));
})();
console.timeEnd('parse');

function run(input, steps = 0) {
  console.time('run');
  let world = input.reduce((o, fish) => {
    o.set(fish, (o.get(fish) || 0) + 1);
    return o;
  }, new Map());

  for (let step = 0; step < steps; step++) {
    const next = new Map();
    for (const [fish_life, count] of world.entries()) {
      if (fish_life === 0) {
        next.set(6, (next.get(6) || 0) + count);
        next.set(8, (next.get(8) || 0) + count);
      } else {
        next.set(fish_life - 1, (next.get(fish_life - 1) || 0) + count);
      }
    }

    world = next;
  }
  console.timeEnd('run');

  console.log(world);
  return Array.from(world.values()).reduce((o, count) => o + count);
}

console.log('day80:', run(input, 80));
console.log('day256:', run(input, 256));

memory();
