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
  UpLeft,
  Up,
  UpRight,
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
      dir: Direction.UpLeft,
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
      dir: Direction.UpRight,
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
  const next_chars = [...chars];
  const char = next_chars.shift();

  if (at(input, start) !== char) {
    return [];
  }

  if (!next_chars.length) {
    return [[start]];
  }

  const out: Point[][] = [];
  for (const next of neighbors(input, start)) {
    if (dir !== Direction.Any && next.dir !== dir) continue;

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
        ["X", "M", "A", "S"],
      );

      total += found.length;
    }
  }

  return total;
}

export function solve_two(input: string[]): number {
  let total = 0;

  for (const [line_y, line] of Object.entries(input)) {
    // Skip Edges, since X shape not possible
    if (Number(line_y) === 0 || Number(line_y) === input.length - 1) {
      continue;
    }
    for (const [char_x, char] of Object.entries(line)) {
      // Skip Edges, since X shape not possible
      if (Number(char_x) === 0 || Number(char_x) === line.length - 1) {
        continue;
      }
      if (char !== "A") continue;

      const points = neighbors(input, {
        x: Number(char_x),
        y: Number(line_y),
      });

      const up_left = points.find(({ dir }) => {
        return dir === Direction.UpLeft;
      });
      const up_right = points.find(({ dir }) => {
        return dir === Direction.UpRight;
      });

      if (!up_left || !up_right) continue;

      const found_up_left = [
        search(
          input,
          up_left,
          ["M", "A", "S"],
          Direction.DownRight,
        ),
        search(
          input,
          up_left,
          ["S", "A", "M"],
          Direction.DownRight,
        ),
      ].filter((found) => found.length);

      const found_up_right = [
        search(
          input,
          up_right,
          ["M", "A", "S"],
          Direction.DownLeft,
        ),
        search(
          input,
          up_right,
          ["S", "A", "M"],
          Direction.DownLeft,
        ),
      ].filter((found) => found.length);

      if (found_up_left.length && found_up_right.length) {
        total++;
      }
    }
  }

  return total;
}
