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
    return function (var_id, initialValue = null) {
        return SpindlyStore(var_id, initialValue);
    }
}