const { readFileSync } = require('fs');

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
  //   start-A
  //   start-b
  //   A-c
  //   A-b
  //   b-d
  //   A-end
  //   b-end
  // `;

  return input
    .trim()
    .split('\n')
    .filter((line) => line)
    .reduce((map, line) => {
      const [start, stop] = line.trim().split('-');
      if (!map[start]) map[start] = [stop];
      else map[start].push(stop);

      if (!map[stop]) map[stop] = [start];
      else map[stop].push(start);

      return map;
    }, {});
})();

const START = 'start';
const END = 'end';
const MAX_EXTRA = '_max_extra_visit_';

function get_paths(
  map,
  allow_extra_visit = false,
  start = START,
  visited = new Set()
) {
  if (start === END) return [[END]];
  if (start === start.toLowerCase()) {
    if (visited.has(start)) {
      if (!allow_extra_visit) return null;
      if (visited.has(MAX_EXTRA)) return null;
      visited = new Set([...visited, MAX_EXTRA]);
    } else {
      visited = new Set([...visited, start]);
    }
  }

  const children = map[start];
  if (!children) return null;

  const paths = [];

  for (const child of children) {
    if ((child === START || child === END) && visited.has(child)) continue;
    if (visited.has(child) && (!allow_extra_visit || visited.has(MAX_EXTRA)))
      continue;

    const child_paths = get_paths(map, allow_extra_visit, child, visited);
    if (!child_paths) continue;

    paths.push(
      ...child_paths.map((path) => {
        path.push(start);
        return path;
      })
    );
  }

  if (!paths.length) return null;
  return paths;
}

{
  console.time('part1');
  const paths = get_paths(input);
  console.log('part1:', paths.length);

  console.timeEnd('part1');
  memory();
}

{
  console.time('part2');
  const paths = get_paths(input, true);
  console.log('part2:', paths.length);

  console.timeEnd('part2');
  memory();
}
