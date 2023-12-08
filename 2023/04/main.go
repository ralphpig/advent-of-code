package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"slices"
	"strconv"
	"strings"
)

func parseNumbers(input *[]string) []int {
	out := []int{}

	for _, numStr := range *input {
		if numStr == "" {
			continue
		}

		num, e := strconv.Atoi(numStr)
		if e != nil {
			panic(e)
		}

		out = append(out, num)
	}

	return out
}

type Card struct {
	id      int
	winning []int
	given   []int
	matches int
	points  int
}

// Parse card and return matches
func ParseCard(cardStr *string) Card {
	var tmp []string
	tmp = strings.Split(*cardStr, ": ")
	label, body := strings.Trim(tmp[0], " "), strings.Trim(tmp[1], " ")

	tmp = strings.Split(label, " ")
	id, e := strconv.Atoi(tmp[len(tmp)-1])
	if e != nil {
		panic(e)
	}

	tmp = strings.Split(body, " | ")
	winningStr, givenStr := strings.Trim(tmp[0], " "), strings.Trim(tmp[1], " ")

	tmp = strings.Split(winningStr, " ")
	winning := parseNumbers(&tmp)

	tmp = strings.Split(givenStr, " ")
	given := parseNumbers(&tmp)

	var matches int
	for _, num := range given {
		idx := slices.Index(winning, num)
		if idx == -1 {
			continue
		}

		matches++
	}

	var points int
	if matches > 0 {
		points = int(math.Pow(2, float64(matches-1)))
	}

	return Card{
		id:      id,
		winning: winning,
		given:   given,
		matches: matches,
		points:  points,
	}
}

func CountCards(cards *[]Card) int {
	additional := make(map[int]int)

	for _, card := range *cards {
		additional[card.id]++
		add := additional[card.id]

		for i := 1; i <= card.matches; i++ {
			additional[card.id+i] += add
		}
	}

	var out int
	for _, add := range additional {
		out += add
	}

	return out
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanLines)

	var one int

	cards := []Card{}
	for scanner.Scan() {
		line := scanner.Text()
		card := ParseCard(&line)

		one += card.points
		cards = append(cards, card)
	}

	two := CountCards(&cards)

	fmt.Printf("one: %d\n", one)
	fmt.Printf("two: %d\n", two)
}
