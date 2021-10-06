package main

import (
	"github.com/HasinduLanka/Spindly/Spindly"
	"github.com/HasinduLanka/Spindly/publicstore"
	"github.com/HasinduLanka/Spindly/publicstore/substore1"
)

func main() {
	var a int = 1
	if a == 1 {
		println("a is 1")
	}

	var SV Spindly.SpindlyVar
	SV.Value = 123

	publicstore.Message.Value = ""
	substore1.A.Value = ""

}
