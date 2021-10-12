package spindlyapp

import "github.com/HasinduLanka/Spindly/Spindly"

type GlobalHub struct {
	Instance *Spindly.HubInstance
	AppName  Spindly.SpindlyStore
	Version  Spindly.SpindlyStore
}

var Global = GlobalHub{}.Instanciate("Global")
var Global2 = GlobalHub{}.Instanciate("Global2")

func (hub GlobalHub) Instanciate(InstanceID string) *GlobalHub {
	hub.Instance = &Spindly.HubInstance{
		HubName:    "GlobalHub",
		InstanceID: InstanceID,
		Stores:     make(map[string]*Spindly.SpindlyStore),
	}

	hub.AppName = Spindly.NewSpindlyStore(
		"AppName",
		func() interface{} {
			return ``
		},
		`Spindly Sample App`,
	)
	hub.Instance.Register(&hub.AppName)

	hub.Version = Spindly.NewSpindlyStore(
		"Version",
		func() interface{} {
			return ``
		},
		nil,
	)
	hub.Instance.Register(&hub.Version)

	return &hub
}

func (hub *GlobalHub) Connect(connector *Spindly.HubConnector) {
}

func (hub *GlobalHub) GetAppName() string {
	return hub.AppName.Get().(string)
}
func (hub *GlobalHub) GetVersion() string {
	return hub.Version.Get().(string)
}

type ClockHub struct {
	Instance *Spindly.HubInstance
	Clock134 Spindly.SpindlyStore
}

func (hub ClockHub) Instanciate(InstanceID string) *ClockHub {
	hub.Instance = &Spindly.HubInstance{
		HubName:    "ClockHub",
		InstanceID: InstanceID,
		Stores:     make(map[string]*Spindly.SpindlyStore),
	}

	hub.Clock134 = Spindly.NewSpindlyStore(
		"Clock134",
		func() interface{} {
			return ``
		},
		nil,
	)
	hub.Instance.Register(&hub.Clock134)

	return &hub
}

func (hub *ClockHub) Connect(connector *Spindly.HubConnector) {
}

func (hub *ClockHub) GetClock134() string {
	return hub.Clock134.Get().(string)
}

type ExampleHub struct {
	Instance *Spindly.HubInstance
	Message  Spindly.SpindlyStore
	TextBox1 Spindly.SpindlyStore
}

func (hub ExampleHub) Instanciate(InstanceID string) *ExampleHub {
	hub.Instance = &Spindly.HubInstance{
		HubName:    "ExampleHub",
		InstanceID: InstanceID,
		Stores:     make(map[string]*Spindly.SpindlyStore),
	}

	hub.Message = Spindly.NewSpindlyStore(
		"Message",
		func() interface{} {
			return ``
		},
		nil,
	)
	hub.Instance.Register(&hub.Message)

	hub.TextBox1 = Spindly.NewSpindlyStore(
		"TextBox1",
		func() interface{} {
			return ``
		},
		nil,
	)
	hub.Instance.Register(&hub.TextBox1)

	return &hub
}

func (hub *ExampleHub) Connect(connector *Spindly.HubConnector) {
}

func (hub *ExampleHub) GetMessage() string {
	return hub.Message.Get().(string)
}
func (hub *ExampleHub) GetTextBox1() string {
	return hub.TextBox1.Get().(string)
}
