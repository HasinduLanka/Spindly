package main

import (
	"time"

	"github.com/HasinduLanka/Spindly/spindlyapp"
)

//dcdc

func main() {

	println(" --- Spindly Server --- ")

	spindlyapp.ClockHub_OnInstanciate = StartClock

	spindlyapp.Configure()

	println(spindlyapp.Global.GetAppName())

	spindlyapp.Serve()
}

func StartClock(clock *spindlyapp.ClockHub) {
	// Create a timer to run every second
	timer := time.NewTicker(time.Second)

	// This loop executes every second
	for range timer.C {
		// Get the current time in clocks time zone
		displayTime := TimeIn(time.Now().UTC(), clock.GetTimeZone())

		// Set the spindly store value, this will be immediately synched with the correspoinding svelte store
		clock.ClockFace.Set(displayTime.Format("15:04:05"))
	}
}

// TimeIn returns the time in UTC if the name is "" or "UTC".
// It returns the local time if the name is "Local".
// Otherwise, the name is taken to be a location name in
// the IANA Time Zone database, such as "Africa/Lagos".
func TimeIn(t time.Time, name string) time.Time {
	loc, err := time.LoadLocation(name)
	if err == nil {
		return t.In(loc)
	} else {
		return t
	}
}
