package publicstore

import (
	"github.com/HasinduLanka/Spindly/Spindly"
)

const store_name = "public"

var Message Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World!",
	Template: func() interface{} {
		return string("")
	},
	Store: store_name,
}

var TextBox1 Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Test Text 1",
	Template: func() interface{} {
		return string("")
	},
	Store: store_name,
}
