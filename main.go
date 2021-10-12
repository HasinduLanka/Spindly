package main

import (
	"github.com/HasinduLanka/Spindly/Spindly"
	"github.com/HasinduLanka/Spindly/SpindlyServer"
	"github.com/HasinduLanka/Spindly/spindlyapp"
)

//dcdc

func main() {

	println(" --- Spindly Server --- ")

	router := SpindlyServer.NewRouter()
	SpindlyServer.HandleWS(router)
	SpindlyServer.HandleStatic(router, "public", "index.html")

	hub := Spindly.HubConnector{}

	var global Spindly.HubType = spindlyapp.Global
	global.Connect(&hub)

	println(spindlyapp.Global.GetAppName())

	SpindlyServer.Serve(router, "32510")

}
