import { read_file } from "../util.ts";
import { parse_input, solve_one, solve_two } from "./impl.ts";

async function main() {
  const input = parse_input(await read_file("input"));

  console.table({
    answer_one: solve_one(input),
    answer_two: solve_two(input),
  });
}

main();
