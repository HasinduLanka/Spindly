import SpindlyVar from '../SpindlyVar.js'

const store_name = 'private';

export function PrivateStore(StorePath) {
    return {
        Message: SpindlyVar(store_name),
        TextBox1: SpindlyVar(store_name)
    }
}

export let PrivateStore1 = PrivateStore("public/test1");