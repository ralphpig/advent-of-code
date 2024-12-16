interface RuleMap {
  [page: number]: {
    before: number[];
    after: number[];
  };
}
interface Input {
  rules: number[][];
  rule_map: RuleMap;
  page_updates: number[][];
}

export function parse_input(lines: string[]): Input {
  let rules: number[][] = [];
  let page_updates: number[][] = [];

  let section_delim = false;
  for (const line of lines) {
    if (!line) {
      section_delim = true;
      continue;
    }

    if (!section_delim) {
      rules.push(
        line.split("|").map(Number),
      );
    } else {
      page_updates.push(
        line.split(",").map(Number),
      );
    }
  }

  const rule_map: RuleMap = {};
  for (const [before, after] of rules) {
    if (!rule_map[before]) {
      rule_map[before] = {
        before: [],
        after: [],
      };
    }
    if (!rule_map[after]) {
      rule_map[after] = {
        before: [],
        after: [],
      };
    }

    rule_map[before].after.push(after);
    rule_map[after].before.push(before);
  }

  return {
    rules,
    rule_map,
    page_updates,
  };
}

function is_valid(rule_map: RuleMap, page_list: number[]): boolean {
  for (let i = 0; i < page_list.length; i++) {
    const page = page_list[i];
    const before = i > 0 ? page_list.slice(0, i - 1) : [];
    const after = i < page_list.length - 1 ? page_list.slice(i + 1) : [];

    const valid = before.every((p) => !rule_map[page].after.includes(p)) &&
      after.every((p) => !rule_map[page].before.includes(p));

    // console.log({
    //   page,
    //   page_list,
    //   before,
    //   after,
    //   map: rule_map[page],
    //   valid,
    // });

    if (!valid) {
      return false;
    }
  }

  return true;
}

// function traverse_before(
//   rule_map: RuleMap,
//   page_list: number[],
//   page: number,
// ): number[] {
//   const come_before = rule_map[page].before.filter((p) =>
//     page_list.includes(p)
//   );
//   if (!come_before.length) return [];
// }

// function fix_update(rule_map: RuleMap, page_list: number[]): number[] {
//   const out: number[] = [];
//   for (const page of page_list) {
//     if (out.includes(page)) continue;

//     const come_before = traverse_before(
//       rule_map,
//       page_list.filter((p) => p !== page && !out.includes(p)),
//       page,
//     );
//     out.push(...come_before, page);
//   }

//   return out;
// }

export function solve_one(input: Input): number {
  const valid_list = input.page_updates.filter((page_list) => {
    return is_valid(input.rule_map, page_list);
  });

  let mid_sum = 0;
  for (const valid of valid_list) {
    mid_sum += valid[Math.floor(valid.length / 2)];
  }

  return mid_sum;
}

export function solve_two(input: Input): number {
  const invalid_list = input.page_updates.filter((page_list) => {
    return !is_valid(input.rule_map, page_list);
  });

  console.log({
    rule_map: input.rule_map,
    invalid_list,
  });

  let mid_sum = 0;
  for (const valid of invalid_list) {
    mid_sum += valid[Math.floor(valid.length / 2)];
  }

  return mid_sum;
}
