
package spindlyapp

import (
	"github.com/HasinduLanka/Spindly/SpindlyServer"
	"github.com/gorilla/mux"
)

var router *mux.Router

func Configure() {
	InitializeHubs()
	router = SpindlyServer.NewRouter()
	SpindlyServer.HandleHub(router, HubManager)
	SpindlyServer.HandleStatic(router, "public", "index.html")
}

func Serve() {
	SpindlyServer.Serve(router, "32510")
}

