import fg from "fast-glob";
import SpindlyMake from "./SpindlyMake.js";

let Verbose = false;

export default function SpindlyDev() {
  return {
    name: "SpindlyDev", // this name will show up in warnings and errors
    async buildStart() {
      try {
        await SpindlyMake(Verbose);
      } catch (error) {
        console.error(error);
      }

      // var exec = require('child_process').exec;
      // exec('ls', function callback(error, stdout, stderr) {
      //     console.log('stdout: ' + stdout);
      // });

      // Re-initialize the watch files
      if (Verbose) console.log("Watching Go Files...");

      await WatchFiles("**/**/*.go", this);

      console.log("Spindly Build Finished");

      return null;
    },

    async buildEnd() {
      if (Verbose) console.log("Spindly Build Finished");
    },
  };
}

async function WatchFiles(path, that) {
  const files = await fg(path);
  for (let file of files) {
    if (Verbose) console.log("Watching File: " + file);
    that.addWatchFile(file);
  }
}
