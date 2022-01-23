const { readFileSync } = require('fs');

function memory() {
  const memory_used = process.memoryUsage();
  console.log()
  console.log(
    `heapTotal ${Math.round((memory_used.heapTotal / 1024 / 1024) * 100) / 100} MB`
  );
}

console.time('parse');
const input = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = `
  //   2199943210
  //   3987894921
  //   9856789892
  //   8767896789
  //   9899965678
  // `;

  return input.trim()
    .split('\n')
    .filter(line => line)
    .map((line, y) => {
      return line.trim().split('').map((int, x) => parseInt(int));
    })
})();
console.timeEnd('parse');

function build (input) {
  return input.map((row, y) => {
    return row.map((value, x) => ({
      pos: [y, x],
      value,
      is_visited: false,
    }))
  })
}

function* children(data, point) {
  const [y, x] = point.pos;

  if (y > 0) yield data[y - 1][x];
  if (y + 1 < y_size) yield data[y + 1][x];

  if (x > 0) yield data[y][x - 1];
  if (x + 1 < x_size) yield data[y][x + 1];
}


const y_size = input.length;
const x_size = input[0].length;

function find_min(input) {
  const data = build(input);
  console.time('find_min');

  const min = [];
  const stack = [data[0][0]]
  while (stack.length) {
    const point = stack.pop()

    point.is_visited = true;

    let is_min = true;
    for (const child of children(data, point)) {
      if (!child.is_visited) {
        stack.push(child)
        child.is_visited = true;
      }

      is_min &= child.value > point.value;
    }

    if (is_min) {
      min.push(point)
    }
  }

  console.timeEnd('find_min');
  return min;
}

function find_basin(input, min_list) {
  const data = build(input);
  console.time('find_basin');

  const out = min_list.map(({ pos }) => {
    const [y, x] = pos;

    const min = data[y][x];

    let basin = [min];
    const stack = [min];
    while (stack.length) {
      const point = stack.pop()

      for (const child of children(data, point)) {
        if (child.is_visited) continue;
        if (child.value === 9) continue;
        if (child.value <= point.value) continue;

        stack.push(child)

        const min_sub_child = Array.from(children(data, child)).reduce((min, sub_child) => {
          if (sub_child.value < min.value) return sub_child;
          return min;
        });

        if (min_sub_child === point) {
          child.is_visited = true;
          basin.push(child);
        }
      }
    }

    return basin;
  })

  console.timeEnd('find_basin');
  return out;
}

const min = find_min(input);

console.log(min)
const sum = min.reduce((o, point) => {
  return o + point.value + 1;
}, 0)
console.log('part1:', sum)


const basins = find_basin(input, min)
  .sort((a, b) => b.length - a.length);
console.log(basins)
const product = basins.slice(0, 3).reduce((product, basin) => {
  return product * basin.length;
}, 1)
console.log('part2:', product)

console.log()
memory()