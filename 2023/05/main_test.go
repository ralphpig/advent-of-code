package main

import (
	"fmt"
	"testing"
)

var two_expected = 30

var one_expected = map[int]map[string]int{
	79: {
		"seed":        79,
		"soil":        81,
		"fertilizer":  81,
		"water":       81,
		"light":       74,
		"temperature": 78,
		"humidity":    78,
		"location":    82,
	},
	14: {
		"seed":        14,
		"soil":        14,
		"fertilizer":  53,
		"water":       49,
		"light":       42,
		"temperature": 42,
		"humidity":    43,
		"location":    43,
	},
	55: {
		"seed":        55,
		"soil":        57,
		"fertilizer":  57,
		"water":       53,
		"light":       46,
		"temperature": 82,
		"humidity":    82,
		"location":    86,
	},
	13: {
		"seed":        13,
		"soil":        13,
		"fertilizer":  52,
		"water":       41,
		"light":       34,
		"temperature": 34,
		"humidity":    35,
		"location":    35,
	},
}

var one_test = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

func Test(t *testing.T) {
	al := ParseAlmanac(&one_test)
	fmt.Println(al)
	out := al.Run()
	fmt.Println(out)

	for _, it := range out {
		seed := it["seed"]
		expected := one_expected[seed]
		for k, v := range expected {
			if it[k] != v {
				t.Fatalf("[one] Expected (seed: %d; field: %s) %d, got %d", seed, k, v, it[k])
			}
		}
	}

	lowest := LowestLocation(out)
	if lowest != 35 {
		t.Fatalf("[one] Expected %d, got %d", 35, lowest)
	}
}
