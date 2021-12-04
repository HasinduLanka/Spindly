
package spindlyapp

import (
	"time"

	"github.com/HasinduLanka/Spindly/SpindlyServer"
	"github.com/gorilla/mux"
	"github.com/webview/webview"
)

const Port = "32510"
const debug = true

var router *mux.Router
var wv webview.WebView

func Configure() {
	InitializeHubs()
	router = SpindlyServer.NewRouter()
	SpindlyServer.HandleHub(router, HubManager)
	SpindlyServer.HandleStatic(router, "public", "index.html")

}

func Serve() {
	go func() {
		SpindlyServer.Serve(router, Port)
	}()

	time.Sleep(time.Millisecond * 500)

	wv = webview.New(debug)
	defer wv.Destroy()
	wv.SetTitle("Spindly")
	wv.SetSize(1024, 640, webview.HintMin)
	wv.Navigate("http://localhost:" + Port)
	wv.Run()
}

