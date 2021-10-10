import ConnectHub from '../SpindlyHubs.js'

const hub_name = 'ClockHub';

export function ClockHub(hub_instance_id) {
    let SpindlyStore = ConnectHub(hub_name, hub_instance_id);
    return {
        Clock134: SpindlyStore("Clock134"),
    }
}

