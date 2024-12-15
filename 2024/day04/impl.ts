export function parse_input(lines: string[]): string[] {
  let curr = null;
  for (const line of lines) {
    if (curr === null) {
      curr = line.length;
      continue;
    }

    if (line.length !== curr) {
      throw new Error("All lines must have the same length");
    }
  }

  return lines;
}

enum Direction {
  Any,
  TopLeft,
  Up,
  TopRight,
  Left,
  Right,
  DownLeft,
  Down,
  DownRight,
}
interface Point {
  x: number;
  y: number;
}
interface Vector extends Point {
  dir: Direction;
}
function neighbors(input: string[], point: Point): Vector[] {
  const neighbors = [];

  if (point.x > 0 && point.y > 0) {
    neighbors.push({
      x: point.x - 1,
      y: point.y - 1,
      dir: Direction.TopLeft,
    });
  }

  if (point.y > 0) {
    neighbors.push({
      x: point.x,
      y: point.y - 1,
      dir: Direction.Up,
    });
  }

  if (point.x < input.length - 1 && point.y > 0) {
    neighbors.push({
      x: point.x + 1,
      y: point.y - 1,
      dir: Direction.TopRight,
    });
  }

  if (point.x > 0) {
    neighbors.push({
      x: point.x - 1,
      y: point.y,
      dir: Direction.Left,
    });
  }

  if (point.x < input.length - 1) {
    neighbors.push({
      x: point.x + 1,
      y: point.y,
      dir: Direction.Right,
    });
  }

  if (point.x > 0 && point.y < input[0].length - 1) {
    neighbors.push({
      x: point.x - 1,
      y: point.y + 1,
      dir: Direction.DownLeft,
    });
  }

  if (point.y < input[0].length - 1) {
    neighbors.push({
      x: point.x,
      y: point.y + 1,
      dir: Direction.Down,
    });
  }

  if (point.x < input.length - 1 && point.y < input[0].length - 1) {
    neighbors.push({
      x: point.x + 1,
      y: point.y + 1,
      dir: Direction.DownRight,
    });
  }

  return neighbors;
}
function at(input: string[], point: Point): string | null {
  return input[point.y]?.[point.x] || null;
}

function search(
  input: string[],
  start: Point,
  chars: string[],
  dir: Direction = Direction.Any,
): Point[][] {
  // console.log({
  //   start,
  //   chars,
  //   dir,
  // });
  if (!chars.length) {
    return [[start]];
  }
  const next_chars = [...chars];
  const char = next_chars.shift();

  const out: Point[][] = [];
  for (const next of neighbors(input, start)) {
    if (dir !== Direction.Any && next.dir !== dir) continue;
    if (at(input, next) !== char) continue;

    const found = search(input, next, next_chars, next.dir);
    if (dir !== Direction.Any && found.length > 1) {
      throw new Error(
        "Should not have found more than one match for a given direction",
      );
    }

    out.push(...found);
  }

  for (const found of out) {
    found.unshift(start);
  }

  return out;
}

export function solve_one(input: string[]): number {
  let total = 0;

  for (const [line_y, line] of Object.entries(input)) {
    for (const [char_x, char] of Object.entries(line)) {
      if (char !== "X") continue;

      const found = search(
        input,
        {
          x: Number(char_x),
          y: Number(line_y),
        },
        ["M", "A", "S"],
      );

      // console.log({
      //   found,
      // });

      total += found.length;
    }
  }

  return total;
}

export function solve_two(input: string[]): number {
  let total = 0;

  return total;
}
