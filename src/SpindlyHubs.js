import { writable } from 'svelte/store';

export default function ConnectHub(hubclass, hub_instance_id) {
    let hub = {};

    hub.hubclass = hubclass;
    hub.hub_instance_id = hub_instance_id;
    hub.stores = {};

    const host_protocol = (("https:" == document.location.protocol) ? "wss://" : "ws://");
    const wsurl = host_protocol + document.location.host + "/spindly/ws/" + hubclass + "/" + hub_instance_id;

    hub.send = function (data) { }

    let StoreChanged = function (store_name, store_value) {
        hub.send(JSON.stringify({ [store_name]: store_value }));
    }


    function connectWS() {
        try {
            let socket = new WebSocket(wsurl);

            socket.onopen = () => {
                console.log("Connected to Hub instance " + hubclass + "/" + hub_instance_id);
            };

            socket.onmessage = (event) => {
                console.log("Recieved : ", hub_instance_id, " : ", event.data);
                let data = JSON.parse(event.data);

                for (let store_name in data) {
                    if (data.hasOwnProperty(store_name)) {
                        hub.stores[store_name]._internal_set(data[store_name]);
                    }
                }


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

        const { subscribe, set, update } = writable(initialValue, () => {
            // console.log('got a subscriber');
            return () => {
                // console.log("Cleaning up...");
                delete hub.stores[storename];
            }
        });

        let store = {
            subscribe: subscribe,
            set: newvalue => {
                set(newvalue);
                StoreChanged(storename, newvalue);
            },
            update: update,
            _internal_set: set,
        };

        hub.stores[storename] = store;

        return store;
    }
}
