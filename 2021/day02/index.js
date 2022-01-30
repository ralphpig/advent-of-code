const { readFileSync } = require('fs');

const input = readFileSync('input', { encoding: 'utf-8' }).split('\n');

let horz = 0;
let depth = 0;

for (const command of input) {
  const [type, val] = command.split(' ');
  switch (type) {
    case 'forward':
      horz += parseInt(val);
      break;
    case 'up':
      depth -= parseInt(val);
      break;
    case 'down':
      depth += parseInt(val);
      break;
  }
}

console.log('one:', horz * depth);

let aim = 0;
horz = 0;
depth = 0;

for (const command of input) {
  const [type, val] = command.split(' ');
  switch (type) {
    case 'forward':
      horz += parseInt(val);
      depth += parseInt(val) * aim;
      break;
    case 'up':
      aim -= parseInt(val);
      break;
    case 'down':
      aim += parseInt(val);
      break;
  }
}

console.log('two:', horz * depth);
