package publicstore

import (
	"github.com/HasinduLanka/Spindly/Spindly"
)

var Message Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World!",
	Template: func() interface{} {
		return string("")
	},
	Store: "public",
}

var Text1 Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Test Text 1",
	Template: func() interface{} {
		return string("")
	},
	Store: "public",
}
