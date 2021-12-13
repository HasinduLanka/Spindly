
package spindlyapp

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"time"

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
	go Open("http://localhost:32510")
	SpindlyServer.Serve(router, "32510")
}

// Commands returns a list of possible commands to use to open a url.
func CommandsOld() [][]string {
	var cmds [][]string
	if exe := os.Getenv("BROWSER"); exe != "" {
		cmds = append(cmds, []string{exe})
	}
	switch runtime.GOOS {
	case "darwin":
		cmds = append(cmds, []string{"/usr/bin/open"})
	case "windows":
		cmds = append(cmds, []string{"cmd", "/c", "start"})
	default:
		if os.Getenv("DISPLAY") != "" {
			// xdg-open is only for use in a desktop environment.
			cmds = append(cmds, []string{"xdg-open"})
		}
	}

	cmds = append(cmds,
		[]string{"chrome"},
		[]string{"google-chrome"},
		[]string{"google-chrome-stable"},
		[]string{"msedge"},
		[]string{"chromium"},
		[]string{"firefox"},
	)
	return cmds
}

func Commands(url string) [][]string {

	var cmds [][]string

	switch runtime.GOOS {
	case "darwin":
		cmds = append(cmds, []string{"/usr/bin/open", url})

	case "windows":
		cmds = append(cmds,
			[]string{"start", "chrome", "--app=" + url},
			[]string{"start", "google-chrome", "--app=" + url},
			[]string{"start", "google-chrome-stable", "--app=" + url},
			[]string{"start", "msedge", "--app=" + url},
			[]string{"start", "chromium", "--app=" + url},
			[]string{"start", "firefox", "-ssb " + url},
		)

		cmds = append(cmds, []string{"cmd", "/c", "start", url})

	case "linux":
		cmds = append(cmds,
			[]string{"chrome", "--app=" + url},
			[]string{"google-chrome", "--app=" + url},
			[]string{"google-chrome-stable", "--app=" + url},
			[]string{"msedge", "--app=" + url},
			[]string{"chromium", "--app=" + url},
			[]string{"firefox", "-ssb " + url},
		)

		if os.Getenv("DISPLAY") != "" {
			// xdg-open is only for use in a desktop environment.
			cmds = append(cmds, []string{"xdg-open", url})
		}

	default:
		if os.Getenv("DISPLAY") != "" {
			// xdg-open is only for use in a desktop environment.
			cmds = append(cmds, []string{"xdg-open", url})
		}
	}
	return cmds

}

// Open tries to open url in a browser and reports whether it succeeded.
func Open(url string) bool {
	for _, args := range Commands(url) {
		fmt.Println("Opening", url, "with", args)
		cmd := exec.Command(args[0], args[1:]...)
		if cmd.Start() == nil && appearsSuccessful(cmd, 3*time.Second) {
			return true
		}
	}
	return false
}

// appearsSuccessful reports whether the command appears to have run successfully.
// If the command runs longer than the timeout, it's deemed successful.
// If the command runs within the timeout, it's deemed successful if it exited cleanly.
func appearsSuccessful(cmd *exec.Cmd, timeout time.Duration) bool {
	errc := make(chan error, 1)
	go func() {
		errc <- cmd.Wait()
	}()

	select {
	case <-time.After(timeout):
		return true
	case err := <-errc:
		return err == nil
	}
}

