package spindlyapp

import "github.com/HasinduLanka/Spindly/Spindly"

var HubManager *Spindly.HubManager = Spindly.NewHubManager()

type GlobalHub struct {
	Instance *Spindly.HubInstance
	AppName  Spindly.SpindlyStore
	Version  Spindly.SpindlyStore
}

var Global = GlobalHub{}.New("Global")
var Global2 = GlobalHub{}.New("Global2")

func (hub GlobalHub) New(InstanceID string) *GlobalHub {
	hub.Instanciate(InstanceID)
	return &hub
}

func (hub *GlobalHub) Instanciate(InstanceID string) *Spindly.HubInstance {
	hub.Instance = &Spindly.HubInstance{
		HubClass:   "GlobalHub",
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

	HubManager.Register(hub.Instance)
	return hub.Instance
}

func (hub *GlobalHub) GetAppName() string {
	return hub.AppName.Get().(string)
}
func (hub *GlobalHub) GetVersion() string {
	return hub.Version.Get().(string)
}

type ClockHub struct {
	Instance  *Spindly.HubInstance
	ClockFace Spindly.SpindlyStore
}

var LK = ClockHub{}.New("LK")

func (hub ClockHub) New(InstanceID string) *ClockHub {
	hub.Instanciate(InstanceID)
	return &hub
}

func (hub *ClockHub) Instanciate(InstanceID string) *Spindly.HubInstance {
	hub.Instance = &Spindly.HubInstance{
		HubClass:   "ClockHub",
		InstanceID: InstanceID,
		Stores:     make(map[string]*Spindly.SpindlyStore),
	}

	hub.ClockFace = Spindly.NewSpindlyStore(
		"ClockFace",
		func() interface{} {
			return ``
		},
		nil,
	)
	hub.Instance.Register(&hub.ClockFace)

	HubManager.Register(hub.Instance)
	return hub.Instance
}

func (hub *ClockHub) GetClockFace() string {
	return hub.ClockFace.Get().(string)
}

type ExampleHub struct {
	Instance *Spindly.HubInstance
	Message  Spindly.SpindlyStore
	TextBox1 Spindly.SpindlyStore
}

func (hub ExampleHub) New(InstanceID string) *ExampleHub {
	hub.Instanciate(InstanceID)
	return &hub
}

func (hub *ExampleHub) Instanciate(InstanceID string) *Spindly.HubInstance {
	hub.Instance = &Spindly.HubInstance{
		HubClass:   "ExampleHub",
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

	HubManager.Register(hub.Instance)
	return hub.Instance
}

func (hub *ExampleHub) GetMessage() string {
	return hub.Message.Get().(string)
}
func (hub *ExampleHub) GetTextBox1() string {
	return hub.TextBox1.Get().(string)
}

func init() {
	HubManager.RegisterClass("GlobalHub", func() Spindly.HubClass { return &GlobalHub{} })
	HubManager.RegisterClass("ClockHub", func() Spindly.HubClass { return &ClockHub{} })
	HubManager.RegisterClass("ExampleHub", func() Spindly.HubClass { return &ExampleHub{} })
}
