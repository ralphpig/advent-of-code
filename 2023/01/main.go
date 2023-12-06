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

func One(input *string) int {
    var first int
    var curr int

    for _, ch := range *input {
        if !unicode.IsDigit(ch) { continue }

        curr = RuneToInt(ch)
        if first == 0 {
            first = curr
        }
    }

    out := first * 10 + curr
    return out;
}

var digit_map = map[string]int {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
}

func Two(input *string) int {
    var first int
    var curr int

    len := len(*input)
    for i, ch := range *input {
        if unicode.IsDigit(ch) {
            curr = RuneToInt(ch)
            if first == 0 {
                first = curr
            }
            continue;
        }

        pthree, pfour, pfive := i+3, i+4, i+5

        if pthree <= len {
            three, ok := digit_map[(*input)[i:pthree]]

            if ok && three != 0 {
                curr = three
            }
        }

        if pfour <= len {
            four, ok := digit_map[(*input)[i:pfour]]

            if ok && four != 0 {
                curr = four
            }
        }
    
        if pfive <= len {
            five, ok := digit_map[(*input)[i:pfive]]

            if ok && five != 0 {
                curr = five
            }
        }

        if first == 0 {
            first = curr
        }
    }

    out := first * 10 + curr
    return out;
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Split(bufio.ScanLines)

    var one int
    var two int
    for scanner.Scan() {
        line := scanner.Text()
        one += One(&line)
        two += Two(&line)
    }

    fmt.Printf("one: %d\n", one)
    fmt.Printf("two: %d\n", two)
}