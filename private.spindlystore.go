package main

import (
	"github.com/HasinduLanka/Spindly/Spindly"
)

const store_name = "private"

var pvt1 Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World!",
	Template: func() interface{} {
		return string("dcdc")
	},
	Store: store_name,
}
