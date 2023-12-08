package main

import (
	"fmt"
	"strings"
	"testing"
)

var one_expected = 4361
var two_expected = 467835

var one_input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

var one_test = strings.Split(one_input, "\n")

func Test(t *testing.T) {
	var one int
	var two int

	one_map := ParseParts(&one_test)
	fmt.Println(one_map)

	one_nums := LookupParts(&one_test, &one_map)
	fmt.Println(one_nums)

	for _, num := range one_nums {
		one += num.val
	}
	if one != one_expected {
		t.Fatalf("[one] Expected %d, got %d", one_expected, one)
	}

	two_gears := LookupGears(&one_test, &one_map)
	fmt.Println(two_gears)

	for _, num := range two_gears {
		two += num.ratio
	}
	if two != two_expected {
		t.Fatalf("[two] Expected %d, got %d", two_expected, two)
	}
}
