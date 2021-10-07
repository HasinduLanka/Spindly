export let GoStorePackageName = "SpindlyStores";

export let SpindlyStores = {
    Global: {
        // File path prefix for js files.
        // For example "storesfolder/file1" becomes "src/storesfolder/file1.spindlystore.js"
        filepath: "stores/global",

        // Variables that are stored.
        store: {
            // Variable name. First letter must be capital, if not it won't be available outside the 'GoStorePackage'
            Message: {
                // Variable type : used to determine the type of variable in go code. No effect on javascript code.
                // Can be "string", "int", "bool", "float" or any type/struct name that is defined in go code, that can be serialized to json.
                type: "string",

                // Go expression that will be evaluated each time the variable is deserialized from json.
                // For example : use "``" for strings, "0" for ints, "MyStruct{}" for structs.
                template: "``",

                // Initial value of the variable stored in js code. May be a js primitive or object or null.
                default: "",

            },
            TextBox1: {
                type: "string",
                template: "``",
                default: "",
            },
            Count: {
                type: "int",
                template: "``",
                default: "",
            },
        },

        // Store instances that are preconfigured to use this store template. 
        // These instance names are used to subscribe to the store from both go and javascript code.
        // First letter must be capital, if not it won't be available outside the 'GoStorePackage'
        // Must be unique from other store instances and store names.
        instances: ["Global1", "Global2"],
    },
    Clock: {
        filepath: "stores/clock",
        store: {
            Clock134: {
                type: "string",
                template: "``",
                default: "",
            }
        }
    }
}