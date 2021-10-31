
import fg from 'fast-glob';
import fs from 'fs';

let Verbose = false;
let GoStoreFileName;

export default async function SpindlyMake(verbose = false) {
    Verbose = verbose;

    if (Verbose) console.log('Spindly Make Started');

    let SpindlyStores = JSON.parse(fs.readFileSync('SpindlyStores.json', 'utf8'));

    const GoStorePackageName = "spindlyapp";

    GoStoreFileName = GoStorePackageName + "/spindlyhubs.go";

    await CleanSpindlyHubs();

    let MakePromises = [];

    // Make the Go store file
    let go = `package ${GoStorePackageName}

import "github.com/HasinduLanka/Spindly/Spindly"

var HubManager *Spindly.HubManager = Spindly.NewHubManager()
`
    const hublist = Object.entries(SpindlyStores);


    for (const [hubclass, hub] of hublist) {


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

const hub_name = '${hubclass}';

export function ${hubclass}(hub_instance_id) {
    let SpindlyStore = ConnectHub(hub_name, hub_instance_id);
    return {
`;
            go += `
type ${hubclass} struct {
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
var ${hubclass}_OnInstanciate func(*${hubclass})

`

            if ((hub.hasOwnProperty("instances")) && (hub.instances.length > 0)) {
                for (const instname of hub.instances) {
                    js += `export let ${instname} = ${hubclass}("${instname}");\n`;
                    go += `var ${instname} *${hubclass}\n`
                }
            }

            go += `
func (hub ${hubclass}) New(InstanceID string) *${hubclass} {
    hub.Instanciate(InstanceID)
    return &hub
}
            
func (hub *${hubclass}) Instanciate(InstanceID string) *Spindly.HubInstance {
	hub.Instance = &Spindly.HubInstance{
		HubClass:    "${hubclass}",
		InstanceID: InstanceID,
		Stores:     make(map[string]*Spindly.SpindlyStore),
	}
`


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
    hub.Instance.Register(&hub.${name})
`;

            }

            go += `
	HubManager.Register(hub.Instance)
    if ${hubclass}_OnInstanciate != nil {
		go ${hubclass}_OnInstanciate(hub)
	}
    return hub.Instance
}
`;


            for (const [name, V] of Object.entries(hub.stores)) {
                go += `
func (hub *${hubclass}) Get${name}() ${V.type} {
    return hub.${name}.Get().(${V.type})
}`;
            }
            //instances
            go += `\n`;


            fs.writeFileSync(jshub, js);

        }

        if (Verbose) {
            await MakeSvelteHub(hubclass, hub);
        } else {
            // Concurency
            MakePromises.push(MakeSvelteHub(hubclass, hub));
        }

    }

    go += `
func InitializeHubs() {
`


    for (const [hubclass, hub] of hublist) {
        go += `    HubManager.RegisterClass("${hubclass}", func() Spindly.HubClass { return &${hubclass}{} })
`
        if ((hub.hasOwnProperty("instances")) && (hub.instances.length > 0)) {
            for (const instname of hub.instances) {
                go += `${instname} = ${hubclass}{}.New("${instname}")\n`
            }
        }
    }
    go += `}`

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