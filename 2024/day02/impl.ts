export function parse_input(lines: string[]): number[][] {
  return lines
    .map((line) => {
      const arr = line.split(" ").filter(Boolean);

      return arr.map(Number);
    });
}

// Return set of altered reports to re-test
type ProblemDampener = (report: number[], index: number | string) => number[][];

function is_safe(report: number[], dampener?: ProblemDampener): boolean {
  let safe = true;
  let last;
  let last_dir;

  const run_dampener = (index: string | number) => {
    if (!dampener) return false;
    return dampener(report, index)
      .map((new_report) => is_safe(new_report))
      .some(Boolean);
  };

  for (const index in report) {
    const level = report[index];
    if (!last) {
      last = level;
      continue;
    }

    const diff = level - last;
    const abs_diff = Math.abs(diff);
    const dir = diff / abs_diff; // +1 or -1

    // Any two adjacent levels differ by at least one and at most three.
    if (!(abs_diff >= 1 && abs_diff <= 3)) {
      safe = run_dampener(index);
      break;
    }

    //  The levels are either all increasing or all decreasing.
    if (last_dir && dir !== last_dir) {
      safe = run_dampener(index);
      break;
    }

    last_dir = dir;
    last = level;
  }

  return safe;
}

/*
  The levels are either all increasing or all decreasing.
  Any two adjacent levels differ by at least one and at most three.
*/
export function solve_one(input: number[][]): number {
  let total_safe = 0;

  for (const report of input) {
    if (is_safe(report)) {
      total_safe++;
    }
  }

  return total_safe;
}

export function solve_two(input: number[][]): number {
  let total_safe = 0;

  const dampener: ProblemDampener = (report, index) => {
    index = Number(index);
    const out = [];

    if (index - 2 >= 0) {
      const n = [...report];
      n.splice(index - 2, 1);
      out.push(n);
    }

    if (index - 1 >= 0) {
      const n = [...report];
      n.splice(index - 1, 1);
      out.push(n);
    }

    const n = [...report];
    n.splice(index, 1);
    out.push(n);

    return out;
  };

  for (const report of input) {
    if (is_safe(report, dampener)) {
      total_safe++;
    }
  }

  return total_safe;
}
