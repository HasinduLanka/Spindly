
import fg from 'fast-glob';
import fs from 'fs';
// import { SpindlyStores, GoStorePackageName } from './SpindlyStores.js';

let Verbose = false;
let GoStoreFileName;

export default async function SpindlyMake(verbose = false) {
    Verbose = verbose;

    if (Verbose) console.log('Spindly Make Started');

    let SpindlyStores = JSON.parse(fs.readFileSync('SpindlyStores.json', 'utf8'));

    let GoStorePackageName = "SpindlyStores";

    GoStoreFileName = GoStorePackageName + "/" + GoStorePackageName + ".spindlyhubs.go";

    await CleanSpindlyHubs();

    let MakePromises = [];

    // Make the Go store file
    let go = `package ${GoStorePackageName}

import "github.com/HasinduLanka/Spindly/Spindly"
`


    for (const [hubname, hub] of Object.entries(SpindlyStores)) {


        async function MakeSvelteHub() {
            // Get the name of the store

            let jshub = `src/${hub.filepath}.spindlyhubs.js`;

            if (Verbose) console.log("\tJS Hub : ", jshub);

            CreateDir(jshub);


            // Count how many nested directories are in the file path
            // and make rootDirPath for js module imports
            let rootDirPath = '';
            for (let i = 0; i < hub.filepath.length; i++) {
                if (hub.filepath[i] == '/') {
                    rootDirPath += "../";
                }
            }

            if (rootDirPath.length == 0) {
                rootDirPath = './';
            }


            // Make the svelte Hub file
            let js = `import ConnectHub from '${rootDirPath}SpindlyHubs.js'

const hub_name = '${hubname}';

export function ${hubname}(hub_instance_id) {
    let SpindlyStore = ConnectHub(hub_name, hub_instance_id);
    return {
`;
            go += `
type ${hubname} struct {
    Instance *Spindly.HubInstance
`


            for (const [name, V] of Object.entries(hub.stores)) {
                if (Verbose) console.log("\t\SpindlyStore : ", name);

                js += `        ${name}: SpindlyStore("${name}"),\n`;
                go += `\t${name} Spindly.SpindlyStore\n`;

            }


            js += `    }
}

`;
            go += `}

`

            if ((hub.hasOwnProperty("instances")) && (hub.instances.length > 0)) {
                for (const instname of hub.instances) {
                    js += `export let ${instname} = ${hubname}("${instname}");\n`;
                    go += `var ${instname} = ${hubname}{}.Instanciate("${instname}")\n`
                }
            }

            go += `
func (hub ${hubname}) Instanciate(InstanceID string) *${hubname} {
	hub.Instance = &Spindly.HubInstance{
		HubName:    "${hubname}",
		InstanceID: InstanceID,
	}

	return &hub
}

func (hub *${hubname}) Connect(connector *Spindly.HubConnector) {
`;

            for (const [name, V] of Object.entries(hub.stores)) {
                go += `
    hub.${name} = Spindly.NewSpindlyStore(
		"${name}",
		func() interface{} {
			return ${V.template}
		},`;

                if ((V.hasOwnProperty("default")) && (V.default)) {
                    go += `
		${V.default},`;
                } else {
                    go += `
        nil,`;
                }

                go += `
	)
    connector.Register(&hub.${name})
`;

            }

            go += `}\n`;

            for (const [name, V] of Object.entries(hub.stores)) {
                go += `
func (hub *${hubname}) Get${name}() ${V.type} {
    return hub.${name}.Get().(${V.type})
}`;
            }
            //instances
            go += `\n`;


            fs.writeFileSync(jshub, js);

        }

        if (Verbose) {
            await MakeSvelteHub(hubname, hub);
        } else {
            // Concurency
            MakePromises.push(MakeSvelteHub(hubname, hub));
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


async function CleanSpindlyHubs() {

    // Optimized for concurency

    let rmGoFile = RemoveFile(GoStoreFileName);

    const jsfiles = await fg("src/**/**/*.spindlyhubs.js");
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