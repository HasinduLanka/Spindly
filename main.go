package main

import (
	"time"

	"github.com/HasinduLanka/Spindly/SpindlyServer"
	"github.com/HasinduLanka/Spindly/spindlyapp"
)

//dcdc

func main() {

	println(" --- Spindly Server --- ")

	router := SpindlyServer.NewRouter()
	SpindlyServer.HandleHub(router, spindlyapp.HubManager)
	SpindlyServer.HandleStatic(router, "public", "index.html")

	println(spindlyapp.Global.GetAppName())

	go StartClock()

	SpindlyServer.Serve(router, "32510")

}

func StartClock() {
	// Create a timer to run every second
	timer := time.NewTicker(time.Second)

	// This loop executes every second
	for t := range timer.C {
		spindlyapp.LK.ClockFace.Set(t.Format("15:04:05"))
	}
}
