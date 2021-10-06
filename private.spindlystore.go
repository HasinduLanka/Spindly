package main

import (
	"github.com/HasinduLanka/Spindly/Spindly"
)

var cdsdc Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World!",
	Template: func() interface{} {
		return string("dcdc")
	},
	Store: "public",
}
