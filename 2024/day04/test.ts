import { assertEquals } from "@std/assert";
import { read_text } from "../util.ts";
import { parse_input, solve_one, solve_two } from "./impl.ts";

Deno.test("answer_one", () => {
  const input = read_text(`
    MMMSXXMASM
    MSAMXMSMSA
    AMXSXMAAMM
    MSAMASMSMX
    XMASAMXAMM
    XXAMMXXAMA
    SMSMSASXSS
    SAXAMASAAA
    MAMMMXMMMM
    MXMXAXMASX
  `);

  assertEquals(solve_one(parse_input(input)), 18);
});

Deno.test("answer_two", () => {
  const input = read_text(`
    MMMSXXMASM
    MSAMXMSMSA
    AMXSXMAAMM
    MSAMASMSMX
    XMASAMXAMM
    XXAMMXXAMA
    SMSMSASXSS
    SAXAMASAAA
    MAMMMXMMMM
    MXMXAXMASX
  `);

  assertEquals(solve_two(parse_input(input)), 9);
});
