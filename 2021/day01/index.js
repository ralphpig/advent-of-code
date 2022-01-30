const { readFileSync } = require('fs');

function count_increases(data) {
  return data.reduce(
    (o, depth) => {
      if (depth > o.last) o.count++;
      o.last = depth;
      return o;
    },
    {
      count: -1,
      last: 0,
    }
  );
}

const input = readFileSync('input', { encoding: 'utf-8' }).split('\n');

const { count: one } = count_increases(input);
console.log('one:', one);

const sum = input.map((item, i) => {
  return parseInt(item) + parseInt(input[i + 1]) + parseInt(input[i + 2]);
});

const { count: two } = count_increases(sum);
console.log('two:', two);
