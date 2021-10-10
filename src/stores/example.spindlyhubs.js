import ConnectHub from '../SpindlyHubs.js'

const hub_name = 'ExampleHub';

export function ExampleHub(hub_instance_id) {
    let SpindlyStore = ConnectHub(hub_name, hub_instance_id);
    return {
        Message: SpindlyStore("Message"),
        TextBox1: SpindlyStore("TextBox1"),
    }
}

