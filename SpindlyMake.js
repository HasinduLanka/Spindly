
import fg from 'fast-glob';
import fs from 'fs';
import { SpindlyStores, GoStorePackageName } from './SpindlyStores.js';

let Verbose = false;
let GoStoreFileName;

export default async function SpindlyMake(verbose = false) {
    Verbose = verbose;

    if (Verbose) console.log('Spindly Make Started');

    GoStoreFileName = GoStorePackageName + "/" + GoStorePackageName + ".spindlystore.go";

    await CleanSpindlyStores();

    let MakePromises = [];

    // Make the Go store file
    let go = `package ${GoStorePackageName}

import "github.com/HasinduLanka/Spindly/Spindly"
`


    for (const [storename, store] of Object.entries(SpindlyStores)) {


        async function MakeSvelteStore() {
            // Get the name of the store

            let jsstore = `src/${store.filepath}.spindlystore.js`;

            if (Verbose) console.log("\tJS Store : ", jsstore);

            CreateDir(jsstore);


            // Count how many nested directories are in the file path
            // and make rootDirPath for js module imports
            let rootDirPath = '';
            for (let i = 0; i < store.filepath.length; i++) {
                if (store.filepath[i] == '/') {
                    rootDirPath += "../";
                }
            }

            if (rootDirPath.length == 0) {
                rootDirPath = './';
            }


            // Make the svelte store file
            let js = `import SpindlyVar from '${rootDirPath}SpindlyVar.js'

const store_name = '${storename}';


`;
            go += `
type ${storename} struct {
    InstanceName string
    StoreName string
`


            for (const [name, V] of Object.entries(store.store)) {
                if (Verbose) console.log("\t\tSpindlyVar : ", name);

                js += `export const ${name} = SpindlyVar(store_name);\n`;
                go += `\t${name} Spindly.SpindlyVar\n`;

            }


            go += `}

`

            if (store["instances"] != undefined && store["instances"].length > 0) {
                for (const instname of store.instances) {
                    go += `var ${instname} = ${storename}{InstanceName: "${instname}"}\n`
                }


            }

            go += `
func (store *${storename}) Connect(connector Spindly.StoreConnector) {
	store.StoreName = "${storename}"
`;

            for (const [name, V] of Object.entries(store.store)) {
                go += `
    store.${name} = Spindly.SpindlyVar{
        Template: func() interface{} {
            return ${V.template}
        },
    }
    connector.Register(store.${name})
`;

            }

            go += `}\n`;

            for (const [name, V] of Object.entries(store.store)) {
                go += `
func (store *${storename}) Get${name}() ${V.type} {
    return store.${name}.Get().(${V.type})
}`;
            }
            //instances
            go += `\n`;


            fs.writeFileSync(jsstore, js);

        }

        if (Verbose) {
            await MakeSvelteStore(storename, store);
        } else {
            // Concurency
            MakePromises.push(MakeSvelteStore(storename, store));
        }

    }

    // Make the Go store file
    fs.writeFileSync(GoStoreFileName, go);

    await Promise.all(MakePromises);

    Exec(`go fmt ${GoStoreFileName} `);

}

function Exec(file) {
    var exec = require('child_process').exec;
    exec(file, function callback(error, stdout, stderr) {
        if (stdout) console.log(file + ': ' + stdout);
        if (stderr) console.log(file + ': Erro : ' + stderr);
        if (error) console.error(error);
    });
}



function CreateDir(filename) {
    // Get directory of the filename
    let dir = filename.substring(0, filename.lastIndexOf('/'));
    if (dir.length != 0) {
        // Make directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            if (Verbose) console.log('\tCreating directory: ' + dir);
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}


function getRegexGroupMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}


async function CleanSpindlyStores() {

    // Optimized for concurency

    let rmGoFile = RemoveFile(GoStoreFileName);

    const jsfiles = await fg("src/**/**/*.spindlystore.js");
    let filesdels = new Array(jsfiles.length + 1);
    filesdels.push(rmGoFile);

    for (let file of jsfiles) {
        filesdels.push(RemoveFile(file));
    }

    CreateDir(GoStoreFileName);

    await Promise.all(filesdels);
}

async function RemoveFile(file) {
    fs.rmSync(file, { force: true });
    return null;
}


//  