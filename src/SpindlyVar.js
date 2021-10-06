import { writable } from 'svelte/store';

export default function SpindlyVar(initialValue = null) {
    const { subscribe, set, update } = writable(initialValue);

    return {
        subscribe: subscribe,
        set: set,
        update: update,
    };
}