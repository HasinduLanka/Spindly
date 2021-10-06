package substore1

import (
	"github.com/HasinduLanka/Spindly/Spindly"
)

const store_name = "sub"

var A Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Hello World!",
	Template: func() interface{} {
		return string("")
	},
	Store: store_name,
}

var B Spindly.SpindlyVar = Spindly.SpindlyVar{
	Value: "Message 2 on go",
	Template: func() interface{} {
		return string("")
	},
	Store: store_name,
}
