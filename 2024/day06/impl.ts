enum Direction {
  Up,
  Right,
  Down,
  Left,
}
interface Point {
  row: number;
  col: number;
}
interface Guard extends Point {
  dir: Direction;
}
interface Input {
  map: string[];
  guard: Guard;
}
export function parse_input(lines: string[]): Input {
  let guard: Guard | undefined;

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      const char = lines[row][col];

      let dir: Direction;
      switch (char) {
        case "^":
          dir = Direction.Up;
          break;
        case ">":
          dir = Direction.Right;
          break;
        case "v":
          dir = Direction.Down;
          break;
        case "<":
          dir = Direction.Left;
          break;
        default:
          continue;
      }

      if (guard) {
        throw new Error("Multiple guards found");
      }

      guard = {
        row,
        col,
        dir,
      };
    }
  }

  if (!guard) {
    throw new Error("No guard found");
  }

  return {
    map: lines,
    guard,
  };
}

function next_point(guard: Guard): Guard {
  const { row, col, dir } = guard;

  switch (dir) {
    case Direction.Up:
      return { row: row - 1, col, dir };
    case Direction.Right:
      return { row, col: col + 1, dir };
    case Direction.Down:
      return { row: row + 1, col, dir };
    case Direction.Left:
      return { row, col: col - 1, dir };
  }
}

function rotate(dir: Direction) {
  switch (dir) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Right:
      return Direction.Down;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
  }
}

export function solve_one(input: Input): number {
  const {
    map,
    guard,
  } = input;

  let total = 0;

  const seen = new Set<string>();
  let curr = guard;
  while (curr) {
    if (!seen.has(`${curr.row},${curr.col}`)) {
      seen.add(`${curr.row},${curr.col}`);
      total++;
    }

    const next = next_point(curr);
    const char = map[next.row]?.[next.col];

    if (!char) {
      break;
    }

    if (char === "#") {
      curr.dir = rotate(curr.dir);
      continue;
    }

    curr = next;
  }

  return total;
}

export function solve_two(input: Input): number {
  return 0;
}
