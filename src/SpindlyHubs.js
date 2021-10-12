import { writable } from 'svelte/store';

export default function ConnectHub(hubname, hub_instance_id) {
    let hub = {};

    hub.hubname = hubname;
    hub.hub_instance_id = hub_instance_id;
    hub.stores = {};

    const host_protocol = (("https:" == document.location.protocol) ? "wss://" : "ws://");
    const wsurl = host_protocol + document.location.host + "/spindly/ws/" + hubname + "/" + hub_instance_id;

    hub.send = function (data) { }

    let StoreChanged = function (store_name, store_value) {
        hub.send(JSON.stringify({ [store_name]: store_value }));
    }


    function connectWS() {
        try {
            let socket = new WebSocket(wsurl);

            socket.onopen = () => {
                console.log("Connected to Hub instance " + hubname + "/" + hub_instance_id);
                socket.send("Hi From the Client!")
            };

            socket.onmessage = (event) => {
                console.log("Recieved : ", hub_instance_id, " : ", event.data);
                // socket.send("Reply from client " + new Date().toLocaleString());
            }

            socket.onclose = event => {
                console.log("Hub closed connection: ", event);
                setTimeout(connectWS, 500);
            };

            socket.onerror = error => {
                console.log("Hub connection error: ", error);
            };

            hub.send = function (data) {
                socket.send(data);
            }


        } catch (error) {
            console.log(error);
            setTimeout(connectWS, 500);
        }
    }

    connectWS();



    return function SpindlyStore(storename, initialValue = null) {

        const { subscribe, set, update } = writable(initialValue);

        let subscribercount = 0;

        let wsubscribe = function (run, callback) {
            subscribercount++;
            // console.log("subscribercount++", subscribercount);

            let wunsubscribe = subscribe(run, callback);
            return () => {
                subscribercount--;
                // console.log("subscribercount--", subscribercount);

                if (subscribercount == 0) {

                    // Free up resources
                    // Delete the store
                    delete hub.stores[storename];

                    // console.log("Cleaning up...");
                }
                return wunsubscribe();
            }
        }

        let store = {
            subscribe: wsubscribe,
            set: newvalue => {
                set(newvalue);
                StoreChanged(storename, newvalue);
            },
            update: update
        };

        hub.stores[storename] = store;

        return store;
    }
}
