const { readFileSync } = require('fs');

const input = readFileSync('input', { encoding: 'utf-8' }).split('\n');
// const input = [
//   '00100',
//   '11110',
//   '10110',
//   '10111',
//   '10101',
//   '01111',
//   '00111',
//   '11100',
//   '10000',
//   '11001',
//   '00010',
//   '01010',
// ]

const bit_length = input[0].length;

const parsed_input = input.map((bin) => parseInt(bin, 2));

function get_gamma_epsilon(data_set, bit_length) {
  const data_length = data_set.length;

  const bit_count = new Array(bit_length).fill(0);
  for (const data of data_set) {
    for (let i = bit_length - 1; i >= 0; --i) {
      bit_count[i] += (data >> i) & 1;
    }
  }
  bit_count.reverse();

  const gamma_bits = bit_count.map((count) => {
    const diff = data_length - count;
    // More 1 bits
    if (count > diff) return 1;
    else if (count < diff) return 0;
    return 1;
  });

  const gamma = gamma_bits.reduce((o, bit) => {
    return (o << 1) | bit;
  }, 0);

  // Only get inverted of bit_length bits
  const bit_length_mask = (1 << bit_length) - 1;
  const epsilon = ~gamma & bit_length_mask;

  return {
    gamma,
    epsilon,
  };
}

const { gamma, epsilon } = get_gamma_epsilon(parsed_input, bit_length);

console.log('gamma:', gamma);
console.log('epsilon:', epsilon);
console.log('product:', gamma * epsilon);
console.log();

let o2 = parsed_input;
let co2 = parsed_input;

for (let i = bit_length - 1; i >= 0; --i) {
  {
    const { gamma } = get_gamma_epsilon(o2, bit_length);
    const gamma_bit = (gamma >> i) & 1;

    if (o2.length > 1)
      o2 = o2.filter((item) => ((item >> i) & 1) === gamma_bit);
  }
  {
    const { epsilon } = get_gamma_epsilon(co2, bit_length);
    const epsilon_bit = (epsilon >> i) & 1;

    if (co2.length > 1)
      co2 = co2.filter((item) => ((item >> i) & 1) === epsilon_bit);
  }
}

console.log('o2:', o2[0]);
console.log('co2:', co2[0]);
console.log('life support:', o2[0] * co2[0]);
