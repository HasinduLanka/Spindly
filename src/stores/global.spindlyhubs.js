import ConnectHub from '../SpindlyHubs.js'

const hub_name = 'GlobalHub';

export function GlobalHub(hub_instance_id) {
    let SpindlyStore = ConnectHub(hub_name, hub_instance_id);
    return {
        AppName: SpindlyStore("AppName"),
        Version: SpindlyStore("Version"),
    }
}

export let Global = GlobalHub("Global");
