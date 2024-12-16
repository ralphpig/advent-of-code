export async function read_file(path: string) {
  return read_text(await Deno.readTextFile("input"));
}
export function read_text(text: string) {
  return text
    .trim()
    .split("\n")
    .map((line) => line.trim());
}
