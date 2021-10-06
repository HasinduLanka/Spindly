
import fg from 'fast-glob';
import fs from 'fs';

let Verbose = false;

export default async function SpindlyMake(verbose = false) {
    Verbose = verbose;

    if (Verbose) console.log('Spindly Make Started');

    await DeleteAllSpindlyStoreJs();

    // Get all *.spindlystore.go files in upto 2 levels of subdirectories
    const files = await fg("**/**/*.spindlystore.go");

    let MakePromises = new Array(files.length);;
    for (let file of files) {
        if (Verbose) {
            await MakeSvelteStore(file);
        } else {
            // Concurency
            MakePromises.push(MakeSvelteStore(file));
        }

    }

    await Promise.all(MakePromises);
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


async function DeleteAllSpindlyStoreJs() {
    const files = await fg("src/**/**/*.spindlystore.js");
    for (let file of files) {
        fs.rmSync(file, { force: true });
    }
}


async function MakeSvelteStore(file) {
    // Get the name of the file path without '.spindlystore.go' suffix
    let filename = file.substring(0, file.length - '.spindlystore.go'.length);


    // Clean up previous *.spindlystore.js files
    let jsstore = `src/${filename}.spindlystore.js`;
    fs.rmSync(jsstore, { force: true });

    if (Verbose) console.log("\tStore : ", jsstore);


    // Get directory of the file
    let dir = "src/" + file.substring(0, file.lastIndexOf('/'));
    if (dir.length != 0) {
        dir += '/';
        // Make directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            if (Verbose) console.log('\tCreating directory: ' + dir);
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    // Count how many nested directories are in the file path
    // and make rootDirPath for js module imports
    let rootDirPath = '';
    for (let i = 0; i < filename.length; i++) {
        if (filename[i] == '/') {
            rootDirPath += "../";
        }
    }

    if (rootDirPath.length == 0) {
        rootDirPath = './';
    }


    // Get the go file contents
    const data = fs.readFileSync(file, 'utf8');

    // Get the store name
    let storename = "default";
    let storenames = getRegexGroupMatches(data, / *const +.*?store_name.*? *= *"([a-zA-Z1-9_]+)"/g, 1);

    if (storenames.length > 0) {
        storename = storenames[0];
    }



    // Find "var VARIABLE_NAME1 Spindly.SpindlyVar" patterns
    let matches = getRegexGroupMatches(data, / *var +([a-zA-Z1-9_]+) +Spindly.SpindlyVar/g, 1);

    // Make the svelte store file
    let js = `import SpindlyVar from '${rootDirPath}SpindlyVar.js'

export const store_name = '${storename}';

`;

    for (const match of matches) {
        if (Verbose) console.log("\t\tSpindlyVar : ", match);
        js += `export const ${match} = SpindlyVar();\n`;
    }

    fs.writeFileSync(jsstore, js);
}


//  