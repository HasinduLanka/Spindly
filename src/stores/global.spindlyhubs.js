import ConnectHub from '../SpindlyHubs.js'

const hub_name = 'GlobalHub';

export function GlobalHub(hub_instance_id) {
    let SpindlyStore = ConnectHub(hub_name, hub_instance_id);
    let SpindlyEventStore = (storename) => {
        let es = SpindlyStore(storename);
        return () => { es.set(Math.random()); };
    };
    return {
        AppName: SpindlyStore("AppName"),
        Version: SpindlyStore("Version"),
        SaidHello: SpindlyEventStore("SaidHello"),
        HelloMessage: SpindlyStore("HelloMessage"),
    }
}

export let Global = GlobalHub("Global");
