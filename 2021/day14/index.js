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

function run(start, rules, step_count) {
  // Counts of pairs
  const pair_map = Array.from(start).reduce((o, _, i, arr) => {
    if (i > start.length - 2) return o;

    const pair = arr.slice(i, i + 2).join('');
    o[pair] = (o[pair] || 0) + 1;

    return o;
  }, {});

  // Counts of chars
  const char_map = Array.from(start).reduce((o, char) => {
    o[char] = (o[char] || 0) + 1;

    return o;
  }, {});

  for (let step = 0; step < step_count; step++) {
    for (const [pair, count] of Object.entries(pair_map)) {
      const insert = rules[pair];

      if (insert && count) {
        const [start, end] = pair.split('');
        const a = start + insert;
        const b = insert + end;

        pair_map[pair] -= count;
        pair_map[a] = (pair_map[a] || 0) + count;
        pair_map[b] = (pair_map[b] || 0) + count;

        char_map[insert] = (char_map[insert] || 0) + count;
      }
    }
  }

  return {
    pair_map,
    char_map,
  };
}

{
  console.time('part1');
  const { char_map } = run(start, rules, 10);
  console.timeEnd('part1');
  memory();

  const counts = Object.values(char_map).sort((a, b) => b - a);
  console.log('part1:', counts[0] - counts.slice(-1));
}

{
  console.time('part2');
  const { char_map } = run(start, rules, 40);
  console.timeEnd('part2');
  memory();

  const counts = Object.values(char_map).sort((a, b) => b - a);
  console.log('part2:', counts[0] - counts.slice(-1));
}
