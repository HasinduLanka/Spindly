package main

import (
	"github.com/HasinduLanka/Spindly/Spindly"
)

var Message Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World",
	Template: func() interface{} {
		return string("")
	},
}

var Text1 Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World",
	Template: func() interface{} {
		return string("")
	},
}
