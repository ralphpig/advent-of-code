export function parse_input(lines: string[]): string[] {
  return lines;
}

interface Op {
  op: string;
  a: number | null;
  b: number | null;
}

const parse_regex = /(do|don't|mul)\(([\d]{1,3})?,?([\d]{1,3})?\)/g;
function parse_line(input: string): Op[] {
  const matches = input.matchAll(parse_regex);

  const out = [];
  for (
    const match of matches
  ) {
    const [_match, op, a, b] = match;
    out.push({
      op,
      a: a ? Number(a) : null,
      b: b ? Number(b) : null,
    });
  }
  return out;
}

export function solve_one(input: string[]): number {
  let total = 0;

  for (const line of input) {
    for (
      const { op, a, b } of parse_line(line)
    ) {
      if (op != "mul") continue;
      if (!a || !b) continue;

      total += a * b;
    }
  }

  return total;
}

export function solve_two(input: string[]): number {
  let total = 0;

  let enabled = true;
  for (const line of input) {
    for (
      const { op, a, b } of parse_line(line)
    ) {
      if (op === "do") {
        enabled = true;
      }
      if (op === "don't") {
        enabled = false;
      }

      if (!enabled) continue;
      if (op !== "mul") continue;
      if (!a || !b) continue;

      total += a * b;
    }
  }

  return total;
}
