const { readFileSync } = require('fs');

function memory() {
  const memory_used = process.memoryUsage();
  console.log(
    'heapTotal',
    Math.round((memory_used.heapTotal / 1024 / 1024) * 100) / 100,
    `MB`
  );
}

function get_input(input) {
  if (!input) input = readFileSync('input', { encoding: 'utf-8' });

  const line = input.trim().split('\n')[0].trim();

  const [, x1, x2, y1, y2] = line.match(
    /target area: x=(-?[\d]+)[.]{2}(-?[\d]+), y=(-?[\d]+)[.]{2}(-?[\d]+)/
  );

  return {
    x: [Number(x1), Number(x2)],
    y: [Number(y1), Number(y2)],
  };
}

function sum(n) {
  return (n * (n + 1)) / 2;
}

function best_init(target) {
  const { x, y } = target;

  const target_h = Math.abs(y[0] - y[1]);
  const x_target = x.sort((a, b) => Math.abs(a) - Math.abs(b))[0];
  const y_entry = Math.max(...y);
  const y_target = Math.min(...y);

  let vel = target_h;
  while (true) {
    let pos = 0;
    // let i = 0;
    let best;
    while (pos > y_target) {
      if (pos < y_entry) best = pos;
      pos += vel
      vel--;
      // i++;
    }
  }

  return { x_target, y_target };
}

{
  const input = get_input('target area: x=20..30, y=-10..-5');

  const best = best_init(input);
  console.log(best);
}
