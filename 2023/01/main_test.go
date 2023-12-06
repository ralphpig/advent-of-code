package main

import (
    "testing"
)

var one_test = [][]interface{} {
    {"1abc2", 12},
    {"pqr3stu8vwx", 38},
    {"a1b2c3d4e5f", 15},
    {"treb7uchet", 77},
}

var two_test = [][]interface{} {
    {"two1nine", 29},
    {"eightwothree", 83},
    {"abcone2threexyz", 13},
    {"xtwone3four", 24},
    {"4nineeightseven2", 42},
    {"zoneight234", 14},
    {"7pqrstsixteen", 76},
}

func Test(t *testing.T) {
    var one int
    for _, it := range one_test {
        input := it[0].(string)
        expect := it[1].(int)

        sum := One(&input)
        if sum != expect {
            t.Fatalf("[one] Expected %d, got %d", expect, sum)
        }

        one += sum
    }
    if one != 142 {
        t.Fatalf("[one] Expected 142, got %d", one)
    }

    var two int
    for _, it := range two_test {
        input := it[0].(string)
        expect := it[1].(int)

        sum := Two(&input)
        if sum != expect {
            t.Fatalf("[two] Expected %d, got %d", expect, sum)
        }

        two += sum
    }
    if two != 281 {
        t.Fatalf("[two] Expected 281, got %d", two)
    }
}