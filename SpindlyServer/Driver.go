package SpindlyServer

import (
	"net/http"

	"github.com/gorilla/mux"
)

var Verbose bool = true

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
func HandleWS(router *mux.Router) {
	wshandler := WSHandler{}
	router.HandleFunc("/spindly/ws/{hubtype}/{instance}", wshandler.ServeHub)
}

// Starts serving router on the given port.
// This function blocks until the server stops.
func Serve(router *mux.Router, port string) {
	srv := &http.Server{
		Handler: router,
		Addr:    "localhost:" + port,
	}

	log("Starting server on http://localhost:" + port)

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

func logerr(err error) {
	println(err.Error())
}
