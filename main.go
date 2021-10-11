package main

import (
	"github.com/HasinduLanka/Spindly/Spindly"
	"github.com/HasinduLanka/Spindly/spindlyapp"
)

//dcdc

func main() {
	var a int = 1
	if a == 1 {
		println("a is 1")
	}

	hub := Spindly.HubConnector{}
	spindlyapp.Global.Connect(&hub)

	println(spindlyapp.Global.GetAppName())

}
