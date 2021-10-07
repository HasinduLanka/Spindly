package publicstore

import "github.com/HasinduLanka/Spindly/Spindly"

type Public struct {
	InstanceName string
	StoreName    string
	Message      Spindly.SpindlyVar
	TextBox1     Spindly.SpindlyVar
}

var PublicStore = Public{InstanceName: "PublicStore"}

func (store *Public) Connect(connector Spindly.StoreConnector) {
	store.StoreName = "Public"

	store.Message = Spindly.SpindlyVar{
		Template: func() interface{} {
			return ``
		},
	}
	connector.Register(store.Message)

	store.TextBox1 = Spindly.SpindlyVar{
		Template: func() interface{} {
			return ""
		},
	}
	connector.Register(store.TextBox1)
}

func (store *Public) GetMessege() string {
	return store.Message.Get().(string)
}

func (store *Public) GetTextBox1() string {
	return store.TextBox1.Get().(string)
}
