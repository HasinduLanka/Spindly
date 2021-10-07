package SpindlyStores

import "github.com/HasinduLanka/Spindly/Spindly"

type Global struct {
	InstanceName string
	StoreName    string
	Message      Spindly.SpindlyVar
	TextBox1     Spindly.SpindlyVar
	Count        Spindly.SpindlyVar
}

var Global1 = Global{InstanceName: "Global1"}
var Global2 = Global{InstanceName: "Global2"}

func (store *Global) Connect(connector Spindly.StoreConnector) {
	store.StoreName = "Global"

	store.Message = Spindly.SpindlyVar{
		Template: func() interface{} {
			return ``
		},
	}
	connector.Register(store.Message)

	store.TextBox1 = Spindly.SpindlyVar{
		Template: func() interface{} {
			return ``
		},
	}
	connector.Register(store.TextBox1)

	store.Count = Spindly.SpindlyVar{
		Template: func() interface{} {
			return ``
		},
	}
	connector.Register(store.Count)
}

func (store *Global) GetMessage() string {
	return store.Message.Get().(string)
}
func (store *Global) GetTextBox1() string {
	return store.TextBox1.Get().(string)
}
func (store *Global) GetCount() int {
	return store.Count.Get().(int)
}

type Clock struct {
	InstanceName string
	StoreName    string
	Clock134     Spindly.SpindlyVar
}

func (store *Clock) Connect(connector Spindly.StoreConnector) {
	store.StoreName = "Clock"

	store.Clock134 = Spindly.SpindlyVar{
		Template: func() interface{} {
			return ``
		},
	}
	connector.Register(store.Clock134)
}

func (store *Clock) GetClock134() string {
	return store.Clock134.Get().(string)
}
