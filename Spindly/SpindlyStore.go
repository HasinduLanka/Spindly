package Spindly

var listnerNextID chan int = make(chan int)

func init() {
	go func() {
		i := 0
		for {
			listnerNextID <- i
			i++
		}
	}()

}

type SpindlyStore struct {
	Name      string
	value     interface{}
	Template  func() interface{}
	Store     *HubConnector
	listeners map[int]chan interface{}
}

func NewSpindlyStore(name string, template func() interface{}, initialValue interface{}) SpindlyStore {
	if initialValue == nil {
		initialValue = template()
	}

	return SpindlyStore{
		Name:      name,
		Template:  template,
		value:     initialValue,
		listeners: make(map[int]chan interface{}),
	}
}

// Returns the value of the variable
func (v *SpindlyStore) Get() interface{} {
	return v.value
}

// Set the value of the variable, notify all listeners and send it to the store
func (v *SpindlyStore) Set(value interface{}) {
	v.received(value)

	if v.Store != nil {
		v.Store.Send(v.Name, value)
	}
}

// Returns a channel that will receive the next values of the variable and a function to unlisten
func (v *SpindlyStore) Listen() (chan interface{}, func()) {
	listener := make(chan interface{})

	id := <-listnerNextID

	v.listeners[id] = listener

	Unlisten := func() {
		delete(v.listeners, id)
	}

	return listener, Unlisten
}

// (Private) Recieved from the store connection or changed by Go
func (v *SpindlyStore) received(value interface{}) {
	v.value = value
	for _, listener := range v.listeners {
		listener <- value
	}
}

// Run a function each time the variable changes
func (v *SpindlyStore) OnChange(f func(interface{})) func() {
	var listner, unlisten = v.Listen()

	var cancel = make(chan bool)
	go func() {
		for {
			select {
			case value := <-listner:
				f(value)
			case <-cancel:
				unlisten()
				return
			}
		}
	}()

	return func() {
		cancel <- true
	}
}

// Waits for the next variable to change and return the value.
// This is a blocking call.
func (v *SpindlyStore) Next() interface{} {
	var listner, unlisten = v.Listen()
	value := <-listner

	unlisten()

	return value
}
