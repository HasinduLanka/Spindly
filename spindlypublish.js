import fg from "fast-glob";
import SpindlyMake from "./spindlymake.js";

let Verbose = true;

export default function SpindlyDev() {
  return {
    name: "SpindlyPublish", // this name will show up in warnings and errors
    async buildStart() {
      try {
        await SpindlyMake(Verbose);
      } catch (error) {
        console.error(error);
      }
      console.log("Spindly Build Finished");

      return null;
    },

    async buildEnd() {

      fs.rmSync("electron-app/src", { force: true, recursive: true });

      CopyFolder("public", "electron-app/src");


      if (Verbose) console.log("Spindly Publish Finished");
      return null;

    },
  };
}



function CopyFolder(from, to) {
  let files = fg.sync(from + "/**/*");
  for (let file of files) {
    let fileName = file.replace(from + "/", "");
    if (fileName.indexOf("/") > -1) {
      let folder = fileName.substring(0, fileName.indexOf("/"));
      if (!fs.existsSync(to + "/" + folder)) {
        fs.mkdirSync(to + "/" + folder);
      }
    }
    fs.copyFileSync(file, to + "/" + fileName);
  }
}