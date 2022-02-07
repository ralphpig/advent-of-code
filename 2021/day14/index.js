const { readFileSync } = require('fs');

function memory() {
  const memory_used = process.memoryUsage();
  console.log(
    'heapTotal',
    Math.round((memory_used.heapTotal / 1024 / 1024) * 100) / 100,
    `MB`
  );
}

const { start, rules } = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = `
  //   NNCB

  //   CH -> B
  //   HH -> N
  //   CB -> H
  //   NH -> C
  //   HB -> C
  //   HC -> B
  //   HN -> C
  //   NN -> C
  //   BH -> H
  //   NC -> B
  //   NB -> B
  //   BN -> B
  //   BB -> N
  //   BC -> B
  //   CC -> N
  //   CN -> C
  // `;

  return input
    .trim()
    .split('\n')
    .reduce(
      (out, line, index) => {
        line = line.trim();
        if (!line.length) return out;

        if (index === 0) {
          out.start = line;
          return out;
        }

        const [pair, insert] = line.split(' -> ');
        out.rules[pair] = insert;
        return out;
      },
      {
        start: null,
        rules: {},
      }
    );
})();

console.log(start, rules);

function run(start, rules, step_count) {
  let curr = start;

  for (let step = 0; step < step_count; step++) {
    let next = [];
    for (let char = 0, len = curr.length; char < len; char++) {
      const pair = curr.slice(char, char + 2);
      const insert = rules[pair];

      if (insert) {
        next.push(pair[0], insert);
      } else {
        next.push(pair);
      }
    }

    curr = next.join('');
  }

  return curr;
}

function count(str) {
  const count_map = {};
  for (const char of str) {
    count_map[char] = (count_map[char] || 0) + 1;
  }

  return count_map;
}

{
  console.time('part1');
  const out = run(start, rules, 10);
  console.timeEnd('part1');
  memory();

  const [first, ...rest] = Object.values(count(out)).sort((a, b) => b - a);
  console.log('part1:', first - rest.slice(-1));
}

{
  console.time('part2');
  const out = run(start, rules, 40);
  console.timeEnd('part2');
  memory();

  const [first, ...rest] = Object.values(count(out)).sort((a, b) => b - a);
  console.log('part2:', first - rest.slice(-1));
}
