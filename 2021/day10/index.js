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
  // let input = `
  //   [({(<(())[]>[[{[]{<()<>>
  //   [(()[<>])]({[<{<<[]>>(
  //   {([(<{}[<>[]}>{[]{[(<()>
  //   (((({<>}<{<{<>}{[]{[]{}
  //   [[<[([]))<([[{}[[()]]]
  //   [{[{({}]{}}([{[{{{}}([]
  //   {<[[]]>}<{[{[{[]{()[[[]
  //   [<(<(<(<{}))><([]([]()
  //   <{([([[(<>()){}]>(<<{{
  //   <{([{{}}[<[[[<>{}]]]>[]]
  // `;

  return input
    .trim()
    .split('\n')
    .filter((line) => line)
    .map((line, y) => {
      return line.trim();
    });
})();
console.timeEnd('parse');

const ERROR = {
  INCOMPLETE: 0,
  CORRUPT: 1,
};

const PAIR_MAP = {
  '(': ')',
  '{': '}',
  '[': ']',
  '<': '>',
  ')': '(',
  '}': '{',
  ']': '[',
  '>': '<',
};

const ERROR_POINT_MAP = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const AUTOCOMPLETE_POINT_MAP = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

function validate(str) {
  const stack = [];

  for (const char of str) {
    switch (char) {
      case '(':
      case '{':
      case '[':
      case '<':
        stack.push(char);
        break;
      case ')':
      case '}':
      case ']':
      case '>':
        const pair = stack.pop();
        if (PAIR_MAP[char] !== pair) {
          return {
            error: ERROR.CORRUPT,
            found: char,
            expected: pair,
          };
        }
        break;
    }
  }

  if (stack.length) {
    return {
      error: ERROR.INCOMPLETE,
      stack,
    };
  }
}

const checked = input.map(validate);

const corrupt_points = checked.reduce((sum, row) => {
  if (!row) return sum;
  if (row.error !== ERROR.CORRUPT) return sum;

  return sum + ERROR_POINT_MAP[row.found];
}, 0);

console.log('part1:', corrupt_points);

const autocomplete_points = checked
  .filter((row) => {
    if (!row) return false;
    if (row.error !== ERROR.INCOMPLETE) return false;
    return true;
  })
  .map((row) => {
    return row.stack.reverse().reduce((sum, char) => {
      return sum * 5 + AUTOCOMPLETE_POINT_MAP[PAIR_MAP[char]];
    }, 0);
  })
  .sort((a, b) => a - b);

const middle = autocomplete_points[Math.floor(autocomplete_points.length / 2)];
console.log('part2:', middle);

console.log();
memory();
