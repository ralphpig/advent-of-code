package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func RuneToInt(r rune) int {
	return int(r - '0')
}

func One(input *string, max_map *map[string]int) (bool, int, map[string]int) {
	var tmp []string
	out := true
	min_count := make(map[string]int)

	tmp = strings.Split(*input, ": ")
	head, body := tmp[0], tmp[1]

	tmp = strings.Split(head, " ")
	id, e := strconv.Atoi(tmp[1])
	if e != nil {
		panic(e)
	}

	plays := strings.Split(body, "; ")
	for _, play := range plays {
		draws := strings.Split(play, ", ")
		for _, draw := range draws {
			tmp = strings.Split(draw, " ")
			count, e := strconv.Atoi(tmp[0])
			if e != nil {
				panic(e)
			}

			color := tmp[1]

			curr, ok := min_count[color]
			if !ok {
				min_count[color] = count
			}
			if count > curr {
				min_count[color] = count
			}

			if count > (*max_map)[color] {
				out = false
			}
		}
	}

	return out, id, min_count
}

var OneMax = map[string]int{
	"red":   12,
	"green": 13,
	"blue":  14,
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanLines)

	var one int
	var two int
	for scanner.Scan() {
		line := scanner.Text()
		ok, id, counts := One(&line, &OneMax)
		if ok {
			one += id
		}

		game_power := 1
		for _, count := range counts {
			game_power *= count
		}

		two += game_power
	}

	fmt.Printf("one: %d\n", one)
	fmt.Printf("two: %d\n", two)
}
