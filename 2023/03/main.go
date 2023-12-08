package main

import (
	"bufio"
	"fmt"
	"os"
	"unicode"
)

func RuneToInt(r rune) int {
	return int(r - '0')
}

func isSpecial(r rune) bool {
	return r != '.' && !unicode.IsDigit(r) && !unicode.IsLetter(r)
}

type Part struct {
	y       int
	x_start int
	x_end   int
	val     int
}
type Gear struct {
	y     int
	x     int
	partA Part
	partB Part
	ratio int
}

type Point = string

func cellStr(y int, x int) Point {
	return fmt.Sprintf("%d,%d", y, x)
}

// Map of each cell that contains a number, and which number
func ParseParts(input *[]string) map[Point]Part {
	out := make(map[string]Part)

	var val int
	var val_len int

	finalizeNum := func(y int, x int) {
		if val_len == 0 {
			return
		}
		x_start := x - val_len
		x_end := x - 1

		num := Part{
			y:       y,
			x_start: x_start,
			x_end:   x_end,
			val:     val,
		}

		for i := x_start; i <= x_end; i++ {
			out[cellStr(y, i)] = num
		}

		val = 0
		val_len = 0
	}

	for y, line := range *input {
		for x, cell := range line {
			if unicode.IsDigit(cell) {
				val = val*10 + RuneToInt(cell)
				val_len++
			} else {
				finalizeNum(y, x)
			}
		}

		finalizeNum(y, len(line))
	}

	return out
}

func adjacent(y int, x int) []Point {
	return []Point{
		cellStr(y-1, x-1),
		cellStr(y-1, x),
		cellStr(y-1, x+1),
		cellStr(y, x-1),
		cellStr(y, x+1),
		cellStr(y+1, x-1),
		cellStr(y+1, x),
		cellStr(y+1, x+1),
	}
}
func adjacentParts(y int, x int, num_map *map[Point]Part) []Part {
	uniq := make(map[Part]bool)

	for _, point := range adjacent(y, x) {
		num, ok := (*num_map)[point]
		if !ok {
			continue
		}

		uniq[num] = true

	}

	out := make([]Part, len(uniq))

	var i int
	for num := range uniq {
		out[i] = num
		i++
	}

	return out
}

func LookupParts(input *[]string, num_map *map[Point]Part) []Part {
	uniq := make(map[Part]bool)

	for y, line := range *input {
		for x, cell := range line {
			if !isSpecial(cell) {
				continue
			}

			for _, part := range adjacentParts(y, x, num_map) {
				uniq[part] = true
			}
		}
	}

	out := make([]Part, len(uniq))

	var i int
	for num := range uniq {
		out[i] = num
		i++
	}

	return out
}

func LookupGears(input *[]string, num_map *map[Point]Part) []Gear {
	out := []Gear{}

	for y, line := range *input {
		for x, cell := range line {
			if cell != '*' {
				continue
			}

			var gear_parts = make([]Part, 2)
			var part_count int

			for _, part := range adjacentParts(y, x, num_map) {
				if part_count >= 2 {
					part_count++
					break
				}

				gear_parts[part_count] = part
				part_count++
			}

			// Not a gear
			if part_count != 2 {
				continue
			}

			out = append(out, Gear{
				y:     y,
				x:     x,
				partA: gear_parts[0],
				partB: gear_parts[1],
				ratio: gear_parts[0].val * gear_parts[1].val,
			})
		}
	}

	return out
}

func main() {
	input := []string{}
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		line := scanner.Text()
		input = append(input, line)
	}

	all_parts := ParseParts(&input)

	var one int
	var two int

	parts := LookupParts(&input, &all_parts)
	for _, part := range parts {
		one += part.val
	}

	gears := LookupGears(&input, &all_parts)
	for _, part := range gears {
		two += part.ratio
	}

	fmt.Printf("one: %d\n", one)
	fmt.Printf("two: %d\n", two)
}
