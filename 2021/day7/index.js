const { readFileSync } = require('fs');

console.time('parse');
const input = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = '16,1,2,0,4,2,7,1,2,14';

  return input
    .trim()
    .split(',')
    .map((d) => parseInt(d));
})();
console.timeEnd('parse');

function calc_fuel(input, choice, fuel_func) {
  return input.reduce((fuel, pos) => {
    let diff = Math.abs(pos - choice);
    if (fuel_func) diff = fuel_func(diff);

    return fuel + diff;
  }, 0);
}

function run(input, fuel_func) {
  console.time('run');

  let max = Math.max(...input);
  let choice = Math.round(max / 2);
  let fuel;

  for (let i = 0; i < input.length; i++) {
    const choice_low = choice === 0 ? max : choice - 1;
    const choice_high = choice === max ? 0 : choice + 1;

    const [min_choice, min_fuel] = [
      [choice, calc_fuel(input, choice, fuel_func)],
      [choice_high, calc_fuel(input, choice_high, fuel_func)],
      [choice_low, calc_fuel(input, choice_low, fuel_func)],
    ].reduce((min, current) => (min[1] < current[1] ? min : current));

    // console.log(min_choice, min_fuel);
    if (choice === min_choice) {
      fuel = min_fuel;
      break;
    }

    choice = min_choice;
    fuel = min_fuel;
  }

  console.timeEnd('run');

  return {
    choice,
    fuel,
  };
}

console.log('part1:', run(input));
console.log(
  'part2:',
  run(input, (fuel) => {
    return (fuel * (fuel + 1)) / 2;
  })
);
