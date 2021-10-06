package Spindly

type SpindlyVar struct {
	Value    interface{}
	Template func() interface{}
}
