package main

import (
	"github.com/HasinduLanka/Spindly/SpindlyStores"
)

//dcdc

func main() {
	var a int = 1
	if a == 1 {
		println("a is 1")
	}

	println(SpindlyStores.Global.AppName)

}
