package substore1

import (
	"github.com/HasinduLanka/Spindly/Spindly"
)

var A Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World!",
	Template: func() interface{} {
		return string("")
	},
	Store: "public",
}

var B Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Message 2 on go",
	Template: func() interface{} {
		return string("")
	},
	Store: "public",
}
