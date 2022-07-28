const { readFileSync } = require('fs');

const STATE = {
  START: 1,
  LEFT: 2,
  DELIM: 3,
  RIGHT: 4,
  DONE: 5,
};

const TYPE = {
  PAIR: 1,
  NODE: 2,
};

class state_machine {
  constructor(data = {}) {
    this.states = {
      [STATE.START]: {
        next() {
          this.state = STATE.LEFT;
        },
      },
      [STATE.LEFT]: {
        next(data) {
          this.data = {
            ...this.data,
            ...data,
          };
          this.state = STATE.DELIM;
        },
      },
      [STATE.DELIM]: {
        next() {
          this.state = STATE.RIGHT;
        },
      },
      [STATE.RIGHT]: {
        next(data) {
          this.data = {
            ...this.data,
            ...data,
          };
          this.state = STATE.DONE;
          this.data.type =
            typeof this.data.left === 'number' &&
            typeof this.data.right === 'number'
              ? TYPE.PAIR
              : TYPE.NODE;
        },
      },
    };

    this.state = STATE.START;
    this.data = data;
  }

  send(action_name, ...args) {
    const action = this.states[this.state]?.[action_name];
    if (!action)
      throw new Error(`Invalid action (${action_name} on ${this.state})`);
    action.call(this, ...args);
  }
}

function get_input(input) {
  if (!input) input = readFileSync('input', { encoding: 'utf-8' });

  return input
    .trim()
    .split('\n')
    .filter((line) => line)
    .map((line) => {
      return parse(line.trim());
    });
}

function parse(iter, initial = null, depth = 0) {
  iter = iter[Symbol.iterator]();
  char = initial || iter.next();

  const fsm = new state_machine({
    left: null,
    right: null,
    type: null
  });

  do {
    switch (fsm.state) {
      case STATE.START:
        if (char.value !== '[')
          throw new Error(`Invalid char (${char.value}) for (${fsm.state})`);

        fsm.send('next');
        break;

      case STATE.DONE:
        if (char.value !== ']')
          throw new Error(`Invalid char (${char.value}) for (${fsm.state})`);

        return fsm.data;

      case STATE.DELIM:
        if (char.value !== ',')
          throw new Error(`Invalid char (${char.value}) for (${fsm.state})`);

        fsm.send('next');
        break;

      case STATE.LEFT:
      case STATE.RIGHT:
        let node = parseInt(char.value);
        if (isNaN(node)) node = parse(iter, char, depth + 1);

        fsm.send('next', {
          [fsm.state === STATE.LEFT ? 'left' : 'right']: node,
        });

        break;
    }
  } while (!(char = iter.next()).done);

  if (fsm.state !== STATE.DONE) throw new Error('Unexpected EOL');
  return fsm.data;
}

function* traverse(node, ltr = true) {
  if (node.left === 'number' && typeof node.right === ) yield node;
  if (ltr) {
    yield* traverse(node.left, ltr);
    yield* traverse(node.right, ltr);
  } else {
    yield* traverse(node.right, ltr);
    yield* traverse(node.left, ltr);
  }
}

function add(left, right) {
  return reduce({
    left,
    right,
  }).node;
}

function reduce(node, depth = 0) {
  console.log(depth, node);
  if (typeof node === 'number') {
    if (node >= 10) {
      return {
        node: {
          left: Math.floor(node / 2),
          right: Math.ceil(node / 2),
          type: TYPE.PAIR
        },
      };
    }

    return {
      node,
    };
  }

  if (
    depth >= 4 &&
    typeof node.left === 'number' &&
    typeof node.right === 'number'
  ) {
    return {
      node: 0,
      action: node,
    };
  }

  const out = {
    node: {},
    action: undefined,
    type: TYPE.NODE
  };

  console.log(depth, 'left', node);
  const { node: left_node, action: left_action = null } = reduce(
    node.left,
    depth + 1
  );
  console.log(depth, 'left', left_node, left_action);

  out.node.left = left_node;

  console.log(depth, 'right');
  const { node: right_node, action: right_action = null } = reduce(
    node.right,
    depth + 1
  );
  console.log(depth, 'right', right_node, right_action);

  out.node.right = right_node;

  if (left_action) {

  }
  if (left_action || right_action) {
    // out.node.left += right_action?.left || 0;
    // out.node.right += left_action?.right || 0;
    out.action = {
      left: left_action?.left,
      right: right_action?.right,
    };
  }

  if (!out.left) console.log(depth, 'NO LEFT');
  console.log(depth, 'out', out);
  return out;
}

// {
//   const input = get_input(`
//     [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]
//   `);

//   const out = input.reduce((o, node) => add(o, node));

//   console.log(JSON.stringify(out, null, 2));
// }

{
  const input = get_input(`
    [1,1]
    [2,2]
    [3,3]
    [4,4]
    [5,5]
  `);

  const out = input.reduce((o, node) => add(o, node));

  console.log(JSON.stringify(out, null, 2));
}
