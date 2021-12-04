package SpindlyServer

import (
	"encoding/json"
	"net/http"

	"github.com/HasinduLanka/Spindly/Spindly"
	"github.com/gorilla/mux"
)

// TODO : False
var Verbose bool = false

func NewRouter() *mux.Router {
	router := mux.NewRouter()
	return router
}

// Handle static content.
func HandleStatic(router *mux.Router, staticPath string, indexPath string) {
	handler := http.FileServer(http.Dir(staticPath))
	spa := ServerHandler{staticPath: staticPath, indexPath: indexPath, handler: handler}
	router.PathPrefix("/").Handler(spa)
}

// Handle websocket connections.
func HandleHub(router *mux.Router, manager *Spindly.HubManager) {
	wshandler := HubServer{Manager: manager}
	router.HandleFunc("/spindly/ws/{hubclass}/{instance}", wshandler.ServeHub)
}

// Starts serving router on the given port.
// This function blocks until the server stops.
func Serve(router *mux.Router, port string) {
	srv := &http.Server{
		Handler: router,
		Addr:    "localhost:" + port,
	}

	println("Host on http://localhost:" + port)

	final := srv.ListenAndServe()
	if final != nil {
		panic(final)
	}
}

func log(msg string) {
	if Verbose {
		println(msg)
	}
}

func logobj(msg string, obj interface{}) {
	if Verbose {
		json, jsonerr := json.Marshal(obj)
		if jsonerr == nil {
			println(msg + " " + string(json))
		} else {
			println(msg)
		}
	}
}

func logerr(err error) {
	println(err.Error())
}

func logerrmsg(msg string, err error) {
	println(msg + "\n" + err.Error())
}
