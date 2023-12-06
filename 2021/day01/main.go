package main

import (
    "fmt"
    "os"
    "bufio"
    "strconv"
)

func check(e error) {
    if e != nil {
        panic(e)
    }
}

func read(file string, cb *func(int)) * []int {
    f, err := os.Open(file)
    check(err)

    defer f.Close()

    scanner := bufio.NewScanner(f)
    scanner.Split(bufio.ScanWords)

    data := []int{}
    for scanner.Scan() {
        val, err := strconv.Atoi(scanner.Text())
        check(err)

        *cb(val)
        data = append(data, val)
    }

    if err := scanner.Err(); err != nil {
        fmt.Println(err)
    }

    return &data;
}

func main() {
    data := read("input", nil)

    fmt.Println(data)
}