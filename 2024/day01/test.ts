import { assertEquals } from "@std/assert";
import { read_text } from "../util.ts";
import { parse_input, solve_one, solve_two } from "./impl.ts";

Deno.test("answer_one", () => {
  const input = read_text(`
    3   4
    4   3
    2   5
    1   3
    3   9
    3   3
  `);

  assertEquals(solve_one(parse_input(input)), 11);
});

Deno.test("answer_two", () => {
  const input = read_text(`
    3   4
    4   3
    2   5
    1   3
    3   9
    3   3
  `);

  assertEquals(solve_two(parse_input(input)), 31);
});
