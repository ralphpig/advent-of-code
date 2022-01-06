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
const lines = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = `
  //   0,9 -> 5,9
  //   8,0 -> 0,8
  //   9,4 -> 3,4
  //   2,2 -> 2,1
  //   7,0 -> 7,4
  //   6,4 -> 2,0
  //   0,9 -> 2,9
  //   3,4 -> 1,4
  //   0,0 -> 8,8
  //   5,5 -> 8,2
  // `;

  const lines = input.split('\n').reduce((o, row) => {
    row = row.trim();
    if (!row.length) return o;

    const line = row
      .split(' -> ')
      .map((point) => point.split(',').map((xy) => parseInt(xy)));
    const [start, end] = line;

    if (start[0] > end[0]) line.reverse();

    o.push(line);

    return o;
  }, []);

  return lines;
})();
console.timeEnd('parse');

const horz_vert = lines.filter(([start, end]) => {
  return start[0] === end[0] || start[1] === end[1];
});

function plot(lines) {
  console.time('plot');
  const out = lines.reduce((o, [start, end]) => {
    const x_diff = end[0] - start[0];
    const y_diff = end[1] - start[1];
    const diff = Math.abs(x_diff || y_diff);

    const x_step = x_diff ? 1 : 0;
    const y_step = y_diff / diff;

    // console.log(start, end, x_step, y_step, x_diff || y_diff);
    for (let i = 0; i <= diff; i++) {
      let x = start[0] + i * x_step;
      let y = start[1] + i * y_step;

      let point = x + ',' + y;
      // console.log(x, y);
      o.set(point, (o.get(point) || 0) + 1);
    }

    return o;
  }, new Map());

  console.timeEnd('plot');
  return out;
}

function count(map) {
  console.time('count');

  let sum = 0;
  for (const count of map.values()) if (count > 1) sum++;

  console.timeEnd('count');
  return sum;
}

const non_diag = count(plot(horz_vert));
console.log('non diag answer:', non_diag);

const complete = count(plot(lines));
console.log('complete answer:', complete);

memory()