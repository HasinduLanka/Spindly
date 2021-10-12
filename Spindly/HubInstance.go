package Spindly

type HubInstance struct {
	HubName    string
	InstanceID string

	Stores map[string]*SpindlyStore
}

func (SI *HubInstance) Register(V *SpindlyStore) {
	SI.Stores[V.Name] = V
}
