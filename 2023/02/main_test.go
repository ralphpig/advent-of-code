package main

import (
	"testing"
)

var one_expected = 8
var two_expected = 2286

var one_test = [][]interface{}{
	{"Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green", true, 48},
	{"Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue", true, 12},
	{"Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red", false, 1560},
	{"Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red", false, 630},
	{"Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green", true, 36},
}

func Test(t *testing.T) {
	var one int
	var two int

	for _, it := range one_test {
		input := it[0].(string)
		expect := it[1].(bool)
		expect_power := it[2].(int)

		ok, id, counts := One(&input, &OneMax)
		if ok != expect {
			t.Fatalf("[one] Expected %t, got %t", expect, ok)
		}
		if ok {
			one += id
		}

		game_power := 1
		for _, count := range counts {
			game_power *= count
		}
		if game_power != expect_power {
			t.Fatalf("[two] Expected %d, got %d", expect_power, game_power)
		}

		two += game_power
	}

	if one != one_expected {
		t.Fatalf("[one] Expected %d, got %d", one_expected, one)
	}
	if two != two_expected {
		t.Fatalf("[two] Expected %d, got %d", two_expected, two)
	}
}
