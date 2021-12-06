import fg from "fast-glob";
import { SpindlyMake } from "./spindlymake.js";

let Verbose = true;

export default function SpindlyDev() {
  return {
    name: "SpindlyDev", // this name will show up in warnings and errors
    async buildStart() {
      try {
        await SpindlyMake(Verbose);
      } catch (error) {
        console.error(error);
      }



      // Re-initialize the watch files
      if (Verbose) console.log("Watching Go Files...");

      const files = fg.sync(["**/**/*.go", "SpindlyStores.json", "!spindlyapp/**"]);
      for (let file of files) {
        if (Verbose) console.log("Watching File: " + file);
        this.addWatchFile(file);
      }


      console.log("Spindly Build Finished");

      return null;
    },

    async buildEnd() {
      if (Verbose) console.log("Spindly Build End");
    },
  };
}


