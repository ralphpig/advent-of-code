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

// Deno.test("answer_two", () => {
//   const input = read_text(`
//     xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
//  `);

//   assertEquals(solve_two(parse_input(input)), 48);
// });
