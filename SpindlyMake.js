
import fg from 'fast-glob';
import fs from 'fs';

export default async function SpindlyMake() {

    console.log('Spindly Make Started');

    await DeleteAllSpindlyStoreJs();

    const files = await fg("**/**/*.spindlystore.go");
    for (let file of files) {

        // Get the name of the file path without '.spindlystore.go' suffix
        let storename = file.substring(0, file.length - '.spindlystore.go'.length);

        // Get directory of the file
        let dir = "src/" + file.substring(0, file.lastIndexOf('/'));
        if (dir.length != 0) {
            dir += '/';
            // Make directory if it doesn't exist
            if (!fs.existsSync(dir)) {
                console.log('\tCreating directory: ' + dir);
                fs.mkdirSync(dir, { recursive: true });
            }
        }

        // Count how many nested directories are in the file path
        let rootDirPath = '';
        for (let i = 0; i < storename.length; i++) {
            if (storename[i] == '/') {
                rootDirPath += "../";
            }
        }

        if (rootDirPath.length == 0) {
            rootDirPath = './';
        }


        const data = fs.readFileSync(file, 'utf8');
        let matches = getRegexGroupMatches(data, / *var +([a-zA-Z1-9_]+) +Spindly.SpindlyVar/g, 1);

        let jsstore = `src/${storename}.spindlystore.js`;

        console.log("\tStore : ", jsstore);

        fs.rmSync(jsstore, { force: true });
        let js = "import SpindlyVar from '" + rootDirPath + "SpindlyVar.js'\n\n";

        for (const match of matches) {
            console.log("\t\tSpindlyVar : ", match);
            js += "export const " + match + " = SpindlyVar();\n"
        }

        fs.writeFileSync(jsstore, js);
    }

    return null;
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