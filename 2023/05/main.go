package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func parseNumbers(input *string) []int {
	var numbers []int
	split := strings.Split(*input, " ")

	for _, s := range split {
		i, e := strconv.Atoi(s)
		if e != nil {
			fmt.Println("error parsing input")
			panic(e)
		}
		numbers = append(numbers, i)
	}

	return numbers
}

type MapEntry struct {
	in_start  int
	out_start int
	size      int
}
type Map struct {
	in      string
	out     string
	entries []MapEntry
}

type Almanac struct {
	seeds []int
	maps  map[string]Map
}

type MappedSeeds = map[string]int

func ParseAlmanac(input *string) Almanac {
	var tmp []string
	chunks := strings.Split(*input, "\n\n")

	tmp = strings.Split(chunks[0], "seeds: ")
	seeds := parseNumbers(&tmp[1])

	maps := make(map[string]Map)
	for _, chunk := range chunks[1:] {
		lines := strings.Split(chunk, "\n")
		name := strings.Split(lines[0], " map:")[0]
		tmp = strings.Split(name, "-to-")
		in, out := tmp[0], tmp[1]

		var entries []MapEntry
		for _, line := range lines[1:] {
			if line == "" {
				continue
			}

			numbers := parseNumbers(&line)
			entries = append(entries, MapEntry{
				out_start: numbers[0],
				in_start:  numbers[1],
				size:      numbers[2],
			})
		}

		maps[in] = Map{
			in:      in,
			out:     out,
			entries: entries,
		}
	}

	return Almanac{
		seeds: seeds,
		maps:  maps,
	}
}

func (al *Almanac) Run() []MappedSeeds {
	out := []MappedSeeds{}
	for _, seed := range al.seeds {
		out = append(out, al.MapSeed(seed))
	}

	return out
}
func (al *Almanac) MapSeed(seed int) MappedSeeds {
	out := MappedSeeds{
		"seed": seed,
	}

	curr := "seed"
	val := seed

	for map_ins, ok := al.maps[curr]; ok; map_ins, ok = al.maps[curr] {
		for _, entry := range map_ins.entries {
			if val >= entry.in_start && val <= entry.in_start+entry.size {
				val = entry.out_start + (val - entry.in_start)
				break
			}
		}

		curr = map_ins.out
		out[curr] = val
	}

	return out
}

func LowestLocation(mapped_seeds []MappedSeeds) int {
	lowest := mapped_seeds[0]["location"]
	for _, seed := range mapped_seeds {
		location, ok := seed["location"]
		if !ok {
			continue
		}

		if location < lowest {
			lowest = location
		}
	}

	return lowest
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	var input string

	for scanner.Scan() {
		input += scanner.Text() + "\n"
	}

	al := ParseAlmanac(&input)
	mapped := al.Run()

	one := LowestLocation(mapped)

	fmt.Printf("one: %d\n", one)
}
