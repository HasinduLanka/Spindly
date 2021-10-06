
import fg from 'fast-glob';
import SpindlyMake from './SpindlyMake.js';

export default function SpindlyDev() {
    return {
        name: 'SpindlyDev', // this name will show up in warnings and errors
        async buildStart() {

            console.log('Spindly Build Started');

            try {
                await SpindlyMake();
            } catch (error) {
                console.error(error);
            }

            // var exec = require('child_process').exec;
            // exec('ls', function callback(error, stdout, stderr) {
            //     console.log('stdout: ' + stdout);
            // });


            // Re-initialize the watch files
            console.log('Watching Go Files...');

            await WatchFiles('**/**/*.go', this);
            return null;
        },


    };
}

async function WatchFiles(path, that) {
    const files = await fg(path);
    for (let file of files) {
        console.log('Watching File: ' + file);
        that.addWatchFile(file);
    }
}