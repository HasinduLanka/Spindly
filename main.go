package main

import (
	"github.com/HasinduLanka/Spindly/Spindly"
	"github.com/HasinduLanka/Spindly/SpindlyStores"
)

func main() {
	var a int = 1
	if a == 1 {
		println("a is 1")
	}

	var SV Spindly.SpindlyVar
	_ = SV

	println(SpindlyStores.Global1.InstanceName)

}
