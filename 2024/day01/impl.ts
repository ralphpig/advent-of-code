export function parse_input(lines: string[]): number[][] {
  return lines
    .map((line) => {
      const arr = line.split(" ").filter(Boolean);
      if (arr.length !== 2) {
        throw new Error(`Expect 2 items in line (${line})`);
      }

      return arr.map(Number);
    });
}

export function solve_one(input: number[][]): number {
  const left = [];
  const right = [];

  for (const [a, b] of input) {
    left.push(a);
    right.push(b);
  }

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  let total = 0;
  for (const i in left) {
    total += Math.abs(left[i] - right[i]);
  }

  return total;
}

export function solve_two(input: number[][]): number {
  const left: number[] = [];
  const right_map: Record<string, number> = {};

  for (const [a, b] of input) {
    left.push(a);
    if (right_map[b]) {
      right_map[b] += 1;
    } else {
      right_map[b] = 1;
    }
  }

  let total = 0;
  for (const it of left) {
    const sim = it * (right_map[it] || 0);
    total += sim;
  }

  return total;
}
