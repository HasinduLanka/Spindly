package spindlyapp

import "github.com/HasinduLanka/Spindly/Spindly"

var HubManager *Spindly.HubManager = Spindly.NewHubManager()

type GlobalHub struct {
	Instance *Spindly.HubInstance
	AppName  Spindly.SpindlyStore
	Version  Spindly.SpindlyStore
}

var GlobalHub_OnInstanciate func(*GlobalHub)

var Global *GlobalHub

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
			return ""
		},
		nil,
	)
	hub.Instance.Register(&hub.Version)

	HubManager.Register(hub.Instance)
	if GlobalHub_OnInstanciate != nil {
		go GlobalHub_OnInstanciate(hub)
	}
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
	TimeZone  Spindly.SpindlyStore
}

var ClockHub_OnInstanciate func(*ClockHub)

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
			return ""
		},
		nil,
	)
	hub.Instance.Register(&hub.ClockFace)

	hub.TimeZone = Spindly.NewSpindlyStore(
		"TimeZone",
		func() interface{} {
			return ""
		},
		`Local`,
	)
	hub.Instance.Register(&hub.TimeZone)

	HubManager.Register(hub.Instance)
	if ClockHub_OnInstanciate != nil {
		go ClockHub_OnInstanciate(hub)
	}
	return hub.Instance
}

func (hub *ClockHub) GetClockFace() string {
	return hub.ClockFace.Get().(string)
}
func (hub *ClockHub) GetTimeZone() string {
	return hub.TimeZone.Get().(string)
}

type ExampleHub struct {
	Instance *Spindly.HubInstance
	Message  Spindly.SpindlyStore
	Greating Spindly.SpindlyStore
}

var ExampleHub_OnInstanciate func(*ExampleHub)

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
			return ""
		},
		nil,
	)
	hub.Instance.Register(&hub.Message)

	hub.Greating = Spindly.NewSpindlyStore(
		"Greating",
		func() interface{} {
			return ""
		},
		`Hello there!`,
	)
	hub.Instance.Register(&hub.Greating)

	HubManager.Register(hub.Instance)
	if ExampleHub_OnInstanciate != nil {
		go ExampleHub_OnInstanciate(hub)
	}
	return hub.Instance
}

func (hub *ExampleHub) GetMessage() string {
	return hub.Message.Get().(string)
}
func (hub *ExampleHub) GetGreating() string {
	return hub.Greating.Get().(string)
}

func InitializeHubs() {
	HubManager.RegisterClass("GlobalHub", func() Spindly.HubClass { return &GlobalHub{} })
	Global = GlobalHub{}.New("Global")
	HubManager.RegisterClass("ClockHub", func() Spindly.HubClass { return &ClockHub{} })
	HubManager.RegisterClass("ExampleHub", func() Spindly.HubClass { return &ExampleHub{} })
}
