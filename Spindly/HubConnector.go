package Spindly

type HubConnector struct {
	Instances map[string]HubInstance
}

func (S *HubConnector) Register(V *SpindlyStore) {

}

func (S *HubConnector) Send(name string, value interface{}) {

}

type HubType interface {
	Connect(connector *HubConnector)
}
