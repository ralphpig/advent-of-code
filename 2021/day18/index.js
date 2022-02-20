const { readFileSync } = require('fs');

const STATE = {
  START: 1,
  LEFT: 2,
  DELIM: 3,
  RIGHT: 4,
  DONE: 5,
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
      return parse(line);
    });
}

function parse(iter, initial = null, depth = 0) {
  iter = iter[Symbol.iterator]();
  char = initial || iter.next();

  const fsm = new state_machine({
    left: null,
    right: null,
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

{
  const input = get_input('[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]');

  console.log(JSON.stringify(input, null, 2));
}
