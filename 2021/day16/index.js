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
  //   C200B40A82
  //   04005AC33890
  //   9C005AC2F8F0
  //   9C0141080250320F1802104A08
  // `;

  return input
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('');
})();

const TYPE = {
  SUM: 0,
  PRODUCT: 1,
  MIN: 2,
  MAX: 3,
  LITERAL: 4,
  IS_GREATER: 5,
  IS_LESS: 6,
  IS_EQUAL: 7,
};

// Wrap iterator to be peekable
function peekable(iterator) {
  if (iterator.peek) return iterator;
  let state = [iterator.next()];
  let count = 0;

  const peeker = (function* () {
    let current;
    do {
      current = state.shift();
      if (current.done) return current.value;

      if (!state.length) {
        state.push(iterator.next());
        count++;
      }
      yield current.value;
    } while (!current.done);
  })();

  peeker.peek = (count = 1) => {
    if (state.length < count) {
      for (
        let i = 0, max = count - state.length, curr = iterator.next();
        i < max, !curr.done;
        i++, curr = iterator.next()
      ) {
        state.push(curr);
        count++;
      }
    }

    return state.slice(0, count).map((el) => el.value);
  };

  peeker.get_count = () => count;

  return peeker;
}

// Iterator over all packets / sub-packets
function* packet_iter(packets) {
  for (const packet of packets) {
    if (!packet.children) continue;
    yield packet;
    yield* packet_iter(packet.children);
  }
}

function parse(bits, depth = 0, multi_packet = true) {
  const bit_iter = peekable(bits[Symbol.iterator]());

  // Read and parse `count` bits
  let bit_step;
  const read = (iter, count, parse = true) => {
    let tmp = '';
    while (tmp.length < count && (bit_step = iter.next()) && !bit_step.done) {
      tmp += bit_step.value;
    }

    return parse ? parseInt(tmp, 2) : tmp;
  };

  const packets = [];
  do {
    let version;
    let type;
    const children = [];

    version = read(bit_iter, 3);
    type = read(bit_iter, 3);

    if (bit_step.done) break;
    switch (type) {
      // Literal
      case TYPE.LITERAL: {
        let literal = '';
        while (!bit_step.done) {
          const final_bit = read(bit_iter, 1);
          literal += read(bit_iter, 4, false);

          if (!final_bit) break;
        }

        children.push(parseInt(literal, 2));

        break;
      }

      // Operator
      default: {
        const length_bit = read(bit_iter, 1);

        if (length_bit) {
          // 11 bit child-count
          const children_count = read(bit_iter, 11);
          for (let i = 0; i < children_count; i++) {
            children.push(...parse(bit_iter, depth + 1, false));
          }
        } else {
          // 15 bit bit-count
          const bit_count = read(bit_iter, 15);
          children.push(...parse(read(bit_iter, bit_count, false), depth + 1));
        }

        break;
      }
    }

    if (depth === 0) {
      // Consuming until byte boundary
      read(bit_iter, bit_iter.get_count() % 4);
      // Consuming 0-byte bytes
      for (
        let peek = bit_iter.peek(4);
        peek.length === 4 && !parseInt(peek.join(''), 2);
        peek = bit_iter.peek(4)
      ) {
        read(bit_iter, 4);
      }
    }

    if (version == null || isNaN(version)) break;
    packets.push({
      version,
      type,
      children,
    });

    if (!multi_packet) break;
  } while (!bit_step.done);

  return packets;
}

function eval_expression(node) {
  if (typeof node !== 'object') return node;
  const children = node.children.map(eval_expression);

  switch (node.type) {
    case TYPE.SUM:
      return children.reduce((o, val) => o + val, 0);
    case TYPE.PRODUCT:
      return children.reduce((o, val) => o * val, 1);
    case TYPE.MIN:
      return Math.min(...children);
    case TYPE.MAX:
      return Math.max(...children);
    case TYPE.LITERAL:
      return children[0];
    case TYPE.IS_GREATER:
      if (node.children.length !== 2)
        throw new Error('IS_GREATER packeted must have 2 children');
      return children[0] > children[1] ? 1 : 0;
    case TYPE.IS_LESS:
      if (node.children.length !== 2)
        throw new Error('IS_GREATER packeted must have 2 children');
      return children[0] < children[1] ? 1 : 0;
    case TYPE.IS_EQUAL:
      if (node.children.length !== 2)
        throw new Error('IS_GREATER packeted must have 2 children');
      return children[0] === children[1] ? 1 : 0;
    default:
      throw new Error('Unknown Operator Type');
  }
}

const bits = input
  .split('')
  .map((char) => parseInt(char, 16).toString(2).padStart(4, 0))
  .join('');

{
  console.time('part1');
  const out = parse(bits);

  const version_total = Array.from(packet_iter(out)).reduce(
    (o, packet) => o + packet.version,
    0
  );
  console.log('part1:', version_total);

  console.timeEnd('part1');
  memory();
}

{
  console.time('part2');

  const out = parse(bits);
  console.log('part2:', out.map(eval_expression));

  console.timeEnd('part2');
  memory();
}
