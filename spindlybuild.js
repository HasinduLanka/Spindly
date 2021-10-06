

export default function spindlybuild() {
    return {
        name: 'spindlybuild', // this name will show up in warnings and errors
        buildStart() {
            console.log('Spindly Build Start');
            var exec = require('child_process').exec;
            exec('ls', function callback(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
            });
            return null;
        }
    };
}