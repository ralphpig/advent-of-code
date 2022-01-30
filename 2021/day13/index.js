const { readFileSync } = require('fs');

function memory() {
  const memory_used = process.memoryUsage();
  console.log(
    'heapTotal',
    Math.round((memory_used.heapTotal / 1024 / 1024) * 100) / 100,
    `MB`
  );
}

const { input, folds } = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = `
  //   6,10
  //   0,14
  //   9,10
  //   0,3
  //   10,4
  //   4,11
  //   6,0
  //   6,12
  //   4,1
  //   0,13
  //   10,12
  //   3,4
  //   3,0
  //   8,4
  //   1,10
  //   2,14
  //   8,10
  //   9,0

  //   fold along y=7
  //   fold along x=5
  // `;

  return input
    .trim()
    .split('\n')
    .filter((line) => line)
    .reduce(
      (out, line) => {
        line = line.trim();
        if (!line.length) return out;

        if (line.startsWith('fold')) {
          const [, fold_axis] = line.split('fold along ');
          const [axis, value] = fold_axis.split('=');

          out.folds.push([axis, Number(value)]);
        } else {
          out.input.set(line, line.split(',').map(Number));
        }

        return out;
      },
      {
        input: new Map(),
        folds: [],
      }
    );
})();

function fold(input, folds) {
  const grid = new Map(input);

  for (const [axis, fold_value] of folds) {
    for (let [str, point] of grid.entries()) {
      const [x, y] = point;
      if (axis === 'y' && y > fold_value) {
        grid.delete(str);
        point = [x, fold_value - (y - fold_value)];
        grid.set(String(point), point);
      } else if (axis === 'x' && x > fold_value) {
        grid.delete(str);
        point = [fold_value - (x - fold_value), y];
        grid.set(String(point), point);
      }
    }
  }

  return grid;
}

function print(grid) {
  const out = [];
  const points = Array.from(grid.values());
  const max_row = Math.max(...points.map(([, y]) => y));
  const max_col = Math.max(...points.map(([x]) => x));

  for (let row = 0; row <= max_row; row++) {
    for (let col = 0; col <= max_col; col++) {
      out.push(grid.has(`${col},${row}`) ? '#' : ' ');
    }
    out.push('\n');
  }

  return out.join('');
}

{
  console.time('part1');
  const grid = fold(input, folds.slice(0, 1));
  console.log('part1:', grid.size);

  console.timeEnd('part1');
  memory();
}

{
  console.time('part2');
  const grid = fold(input, folds);
  console.log('part2:');
  console.log(print(grid));

  console.timeEnd('part2');
  memory();
}
