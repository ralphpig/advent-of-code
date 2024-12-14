export function parse_input(lines: string[]): number[][] {
  return lines
    .map((line) => {
      const arr = line.split(" ").filter(Boolean);

      return arr.map(Number);
    });
}

type ProblemDampener = (report: number[], index: number | string) => number[][];

function is_safe(report: number[], dampener?: ProblemDampener): boolean {
  let safe = true;
  let last;
  let last_dir;

  console.log({
    report,
    dampener: Boolean(dampener),
  });

  const run_dampener = (index: string | number) => {
    if (!dampener) return false;
    return dampener(report, index)
      .map((new_report) => is_safe(new_report))
      .some((safe) => safe);
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

    console.log({
      window: [last, level],
      diff,
      dir_window: [last_dir, dir],
    });

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

  console.log({
    report,
    safe,
    dampener: Boolean(dampener),
  });

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
      console.log({
        safe: report,
      });
      total_safe++;
    }
  }

  return total_safe;
}

export function solve_two(input: number[][]): number {
  let total_safe = 0;

  const dampener: ProblemDampener = (report, index) => {
    const left = [...report];
    left.splice(Number(index) - 1, 1);
    const curr = [...report];
    curr.splice(Number(index), 1);

    return [left, curr];
  };
  for (const report of input) {
    if (is_safe(report, dampener)) {
      console.log({
        safe: report,
      });
      total_safe++;
    }
  }

  return total_safe;
}
