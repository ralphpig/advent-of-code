const { readFileSync } = require('fs');

function memory() {
  const memory_used = process.memoryUsage();
  console.log();
  console.log(
    `heapTotal ${
      Math.round((memory_used.heapTotal / 1024 / 1024) * 100) / 100
    } MB`
  );
}

console.time('parse');
const input = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  //  let input = `
  //    5483143223
  //    2745854711
  //    5264556173
  //    6141336146
  //    6357385478
  //    4167524645
  //    2176841721
  //    6882881134
  //    4846848554
  //    5283751526
  // `;

  return input
    .trim()
    .split('\n')
    .filter((line) => line)
    .map((line, y) => {
      return line
        .trim()
        .split('')
        .map((val, x) => ({
          value: parseInt(val),
          flash_step: -1,
          pos: [y, x],
        }));
    });
})();
console.timeEnd('parse');

function* children(data, point) {
  const y_size = data.length;
  const x_size = data[0].length;

  const [y, x] = point.pos;

  if (y > 0) {
    if (x > 0) yield data[y - 1][x - 1];
    yield data[y - 1][x];
    if (x + 1 < x_size) yield data[y - 1][x + 1];
  }

  if (x > 0) yield data[y][x - 1];
  if (x + 1 < x_size) yield data[y][x + 1];

  if (y + 1 < y_size) {
    if (x > 0) yield data[y + 1][x - 1];
    yield data[y + 1][x];
    if (x + 1 < x_size) yield data[y + 1][x + 1];
  }
}

function clone(data) {
  return [...data.map((row) => [...row.map((cell) => ({ ...cell }))])];
}

function run(data, num_step = null) {
  data = clone(data);
  let flashes = 0;

  const do_flash = (cell, step, ripple) => {
    flashes++;
    cell.flash_step = step;
    cell.value = 0;
    ripple.push(...children(data, cell));
  };

  let step = 1;
  while (true) {
    const ripple = [];
    for (const row of data) {
      for (const cell of row) {
        cell.value++;
        if (cell.value > 9) do_flash(cell, step, ripple);
      }
    }

    if (ripple.length) {
      for (const cell of ripple) {
        if (cell.flash_step === step) continue;

        cell.value++;
        if (cell.value > 9) do_flash(cell, step, ripple);
      }
    }

    if (!num_step) {
      const full_flash = data.reduce((row_flash, row) => {
        return (
          row_flash &&
          row.reduce((flash, cell) => {
            return flash && cell.flash_step === step;
          }, true)
        );
      }, true);

      if (full_flash)
        return {
          full_flash,
          flashes,
          step,
        };
    } else if (step + 1 >= num_step) break;

    step++;
    // console.log(step)
    // console.log(data.map(row => row.map(cell => cell.value).join('')).join('\n'))
  }

  return {
    flashes,
    step,
  };
}

const flashes = run(input, 100);
console.log('part1:', flashes);

const full_flash = run(input);
console.log('part2:', full_flash);

memory();