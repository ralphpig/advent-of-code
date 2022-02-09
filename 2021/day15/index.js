const { readFileSync } = require('fs');
const { exit } = require('process');

function memory() {
  const memory_used = process.memoryUsage();
  console.log(
    'heapTotal',
    Math.round((memory_used.heapTotal / 1024 / 1024) * 100) / 100,
    `MB`
  );
}

const input = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = `
  //   1163751742
  //   1381373672
  //   2136511328
  //   3694931569
  //   7463417111
  //   1319128137
  //   1359912421
  //   3125421639
  //   1293138521
  //   2311944581
  // `;

  return input
    .trim()
    .split('\n')
    .reduce((out, line, y) => {
      line = line.trim();
      if (!line.length) return out;

      const row = line.split('').map(Number);
      out.push(row);

      return out;
    }, []);
})();

function build_map(data) {
  return data.map((row, y) => {
    return row.map((risk, x) => ({
      risk,
      pos: [y, x],
      pos_str: [y, x].toString(),
    }));
  });
}

function* get_children(data, pos) {
  const y_size = data.length;
  const x_size = data[0].length;

  const [y, x] = pos;

  if (y > 0) yield data[y - 1][x];
  if (y + 1 < y_size) yield data[y + 1][x];

  if (x > 0) yield data[y][x - 1];
  if (x + 1 < x_size) yield data[y][x + 1];
}

function wrap_clamp(val, min = 1, max = 9) {
  if (val < min) return wrap_clamp(max - (min - val) + 1, min, max);
  if (val > max) return wrap_clamp(min + (val - max) - 1, min, max);
  return val;
}

function expand(arr, step_count = 1) {
  let rest = [];
  for (const cell of arr) {
    for (let step = 0; step < step_count; step++) {
      if (!rest[step]) rest[step] = [];
      rest[step].push(wrap_clamp(cell + step + 1));
    }
  }

  return rest;
}

function get_path(
  map,
  start = [0, 0],
  end = [map.length - 1, map[0].length - 1]
) {
  end = end.toString();

  const get = ([y, x]) => map[y][x];
  const frontier = [
    {
      cell: get(start),
      parent: null,
      total_risk: 0,
    },
  ];

  const sorted_index = (cell) => {
    let low = 0;
    let high = frontier.length;

    while (low < high) {
      let mid = (low + high) >>> 1;
      if (frontier[mid].total_risk < cell.total_risk) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  const add_frontier = (...cells) => {
    for (const cell of cells) {
      frontier.splice(sorted_index(cell), 0, cell);
    }
  };

  const visited = {};

  while (frontier.length) {
    const entry = frontier.shift();

    if (visited[entry.cell.pos_str]) continue;
    visited[entry.cell.pos_str] = true;

    // End Condition
    if (entry.cell.pos_str === end) {
      const path = [];

      let trace = entry;
      while (trace.parent) {
        path.push(trace);
        trace = trace.parent;
      }

      return path.reverse();
    }

    const children = Array.from(get_children(map, entry.cell.pos))
      .filter(({ pos }) => !visited[pos])
      .map((child) => ({
        cell: child,
        parent: entry,
        total_risk: entry.total_risk + child.risk,
      }));

    add_frontier(...children);
  }
}

{
  console.time('part1');

  const path = get_path(build_map(input));

  console.timeEnd('part1');
  memory();

  console.log('part1:', path.at(-1).total_risk);
}

console.log();

{
  console.time('part2');
  const EXPANSION = 4;

  // Expand x-axis
  const large_map = input.map((row) => {
    const next = expand(row, EXPANSION);
    return [...row, ...[].concat(...next)];
  });

  // Expand y-axis
  const vert_chunk = [];
  for (const row of large_map) {
    expand(row, EXPANSION).forEach((next, i) => {
      if (!vert_chunk[i]) vert_chunk[i] = [];
      vert_chunk[i].push(next);
    });
  }
  for (const chunk of vert_chunk) {
    large_map.push(...chunk);
  }

  const path = get_path(build_map(large_map));

  console.timeEnd('part2');
  memory();

  console.log('part2:', path.at(-1).total_risk);
}
