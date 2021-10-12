import { writable } from 'svelte/store';

function SpindlyStore(var_id, initialValue = null) {
    const { subscribe, set, update } = writable(initialValue);
    return {
        subscribe: subscribe,
        set: set,
        update: update,
    };
}

export default function ConnectHub(hubname, hub_instance_id) {
    let hub = {};

    hub.hubname = hubname;
    hub.hub_instance_id = hub_instance_id;

    const host_protocol = (("https:" == document.location.protocol) ? "wss://" : "ws://");
    const wsurl = host_protocol + document.location.host + "/spindly/ws/" + hubname + "/" + hub_instance_id;




    function connectWS() {
        try {
            let socket = new WebSocket(wsurl);

            socket.onopen = () => {
                console.log("Connected to Hub instance " + hubname + "/" + hub_instance_id);
                socket.send("Hi From the Client!")
            };

            socket.onmessage = (event) => {
                console.log(event.data);
                socket.send("Reply from client " + new Date().toLocaleString());
            }

            socket.onclose = event => {
                console.log("Hub closed connection: ", event);
                setTimeout(connectWS, 500);
            };

            socket.onerror = error => {
                console.log("Hub connection error: ", error);
            };


        } catch (error) {
            console.log(error);
            setTimeout(connectWS, 500);
        }
    }

    connectWS();



    return function (var_id, initialValue = null) {
        return SpindlyStore(var_id, initialValue);
    }
}
