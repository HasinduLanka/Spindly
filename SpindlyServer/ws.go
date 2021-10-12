package SpindlyServer

import (
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type WSHandler struct {
}

// We'll need to define an Upgrader
// this will require a Read and Write buffer size
var upgrader = websocket.Upgrader{
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
	CheckOrigin:       func(r *http.Request) bool { return true },
	EnableCompression: false,
}

// define a wsreader which will listen for
// new messages being sent to our WebSocket
// endpoint
func wsreader(ws *websocket.Conn) (Cancel func()) {
	go func() {
		for {
			// read in a message
			messageType, p, err := ws.ReadMessage()
			if err != nil {
				logerr(err)
				return
			}

			if messageType == websocket.TextMessage {
				log(string(p))
			}

		}
	}()

	canceler := make(chan bool)
	cancel := func() {
		canceler <- true
	}

	// Make a timer channel
	ticker := time.NewTicker(time.Second * 1)
	go func() {
		for {
			select {
			case <-ticker.C:
				// Send a ping to the client
				if err := wsWrite(ws, "Hi from server! "+string(time.Now().Format(time.Stamp))); err != nil {
					logerr(err)
					return
				}
			case <-canceler:
				ticker.Stop()
				return
			}
		}
	}()

	return cancel

}

func wsWrite(conn *websocket.Conn, message string) error {
	return conn.WriteMessage(websocket.TextMessage, []byte(message))
}

func (H WSHandler) ServeHub(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	hubtype := vars["hubtype"]
	instance := vars["instance"]
	log("Hub Connected : " + hubtype + "/" + instance)

	// upgrade this connection to a WebSocket
	// connection
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logerr(err)
	}

	err = ws.WriteMessage(websocket.TextMessage, []byte("Hi from server for "+hubtype+"/"+instance))
	if err != nil {
		logerr(err)
	}
	// listen indefinitely for new messages coming
	// through on our WebSocket connection
	wsreader(ws)
}
