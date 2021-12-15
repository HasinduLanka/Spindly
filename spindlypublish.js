import fg from "fast-glob";
import { SpindlyMake, Driver_Browser, Driver_Webview } from "./spindlymake.js";
import fs from 'fs';
import os from 'os';
import path from 'path';


let Verbose = true;


export default function SpindlyPublish() {

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

      const publishDir = "published-app";

      fs.rmSync(publishDir, { force: true, recursive: true });
      fs.mkdirSync(publishDir);

      let SpindlyConfigs = JSON.parse(fs.readFileSync('SpindlyConfigs.json', 'utf8'));

      let appname = "SpindlyApp";

      if (SpindlyConfigs.hasOwnProperty("appname") && SpindlyConfigs.appname) {
        appname = SpindlyConfigs.appname;
      }




      let alldrivers = [];

      if (SpindlyConfigs.hasOwnProperty("driver") && SpindlyConfigs.driver) {
        alldrivers = SpindlyConfigs.driver;
      }

      let archs = [];

      if (SpindlyConfigs.hasOwnProperty("arch") && SpindlyConfigs.arch) {
        archs = SpindlyConfigs.arch;
      }

      let PublishApp = async (targetos, ext, arch, driver, buildargs = "", envvars = "") => {
        let dir = publishDir + "/" + appname + "-" + targetos + "-" + arch + "-" + driver + "/";
        fs.mkdirSync(dir + "public", { recursive: true });
        CopyFolder("public", dir);
        let cmd = `env GOOS=${targetos} GOARCH=${arch} ${envvars} go build ${buildargs} -o ${dir}${appname}${ext}`;
        await Exec(cmd);

        if (Verbose) console.log("> " + cmd);
        if (Verbose) console.log("Built " + dir + "\n");

      }

      if (process.env.SPINDLYBUILD === "BROWSER") {
        alldrivers = ["browser"];
      }

      if (process.env.SPINDLYBUILD === "WEBVIEW") {
        alldrivers = ["webview"];
      }


      if (alldrivers.indexOf("browser") > -1) {

        fs.writeFileSync("spindlyapp/driver.go", Driver_Browser);


        await Exec(`go mod tidy`);

        if (SpindlyConfigs.hasOwnProperty("os") && SpindlyConfigs.os) {

          let targetos = SpindlyConfigs.os;

          if (targetos.indexOf("windows") > -1) {
            if (archs.indexOf("amd64") > -1) {
              // TODO : 
              // await PublishApp("windows", ".exe", "amd64", "browser", `-ldflags="-H windowsgui"`);
              await PublishApp("windows", ".exe", "amd64", "browser");
            }
            if (archs.indexOf("386") > -1) {
              await PublishApp("windows", ".exe", "386", "browser");
            }

          }

          if (targetos.indexOf("darwin") > -1) {
            if (archs.indexOf("amd64") > -1) {
              await PublishApp("darwin", "", "amd64", "browser");
            }
          }

          if (targetos.indexOf("linux") > -1) {
            if (archs.indexOf("amd64") > -1) {
              await PublishApp("linux", "", "amd64", "browser");
            }
            if (archs.indexOf("386") > -1) {
              await PublishApp("linux", "", "386", "browser");
            }
            if (archs.indexOf("arm") > -1) {
              await PublishApp("linux", "", "arm", "browser");
            }
          }
        }
      }


      if (alldrivers.indexOf("webview") > -1) {

        fs.writeFileSync("spindlyapp/driver.go", Driver_Webview);


        await Exec(`go mod tidy`);

        if (SpindlyConfigs.hasOwnProperty("os") && SpindlyConfigs.os) {

          let targetos = SpindlyConfigs.os;

          let ostype = os.type();
          let osarch = os.arch();

          if ((ostype === "Windows_NT") && targetos.indexOf("windows") > -1) {
            if ((osarch === "x64") && archs.indexOf("amd64") > -1) {
              await PublishApp("windows", ".exe", "amd64", "webview", (SpindlyConfigs.windowscli ? "" : `-ldflags="-H windowsgui"`));
            }
            if ((osarch === "x32") && archs.indexOf("386") > -1) {
              await PublishApp("windows", ".exe", "386", "webview", (SpindlyConfigs.windowscli ? "" : `-ldflags="-H windowsgui"`));
            }

          }

          if ((ostype === "Darwin") && targetos.indexOf("darwin") > -1) {
            if ((osarch === "x64") && archs.indexOf("amd64") > -1) {
              await PublishApp("darwin", "", "amd64", "webview");
            }
          }

          if ((ostype === "Linux") && targetos.indexOf("linux") > -1) {
            if ((osarch === "x64") && archs.indexOf("amd64") > -1) {
              await PublishApp("linux", "", "amd64", "webview");
            }
            if ((osarch === "x32") && archs.indexOf("386") > -1) {
              await PublishApp("linux", "", "386", "webview");
            }
            if ((osarch === "arm") && archs.indexOf("arm") > -1) {
              await PublishApp("linux", "", "arm", "webview");
            }
          }
        }
      }


      if (alldrivers.indexOf("webview-cross") > -1) {

        fs.writeFileSync("spindlyapp/driver.go", Driver_Webview);


        await Exec(`go mod tidy`);

        if (SpindlyConfigs.hasOwnProperty("os") && SpindlyConfigs.os) {

          let targetos = SpindlyConfigs.os;
          const mingenv = `CGO_ENABLED=1 CC=x86_64-w64-mingw32-gcc CXX=x86_64-w64-mingw32-g++`;

          if (targetos.indexOf("windows") > -1) {
            if (archs.indexOf("amd64") > -1) {
              await PublishApp("windows", ".exe", "amd64", "webview-cross", `-ldflags="-H windowsgui"`, mingenv);
            }
            if (archs.indexOf("386") > -1) {
              await PublishApp("windows", ".exe", "386", "webview-cross", `-ldflags="-H windowsgui"`, mingenv);
            }

          }

          if (targetos.indexOf("darwin") > -1) {
            if (archs.indexOf("amd64") > -1) {
              await PublishApp("darwin", "", "amd64", "webview-cross", "", mingenv);
            }
          }

          if (targetos.indexOf("linux") > -1) {
            if (archs.indexOf("amd64") > -1) {
              await PublishApp("linux", "", "amd64", "webview-cross", "", mingenv);
            }
            if (archs.indexOf("386") > -1) {
              await PublishApp("linux", "", "386", "webview-cross", "", mingenv);
            }
            if (archs.indexOf("arm") > -1) {
              await PublishApp("linux", "", "arm", "webview-cross", "", mingenv);
            }
          }
        }
      }


      // fs.mkdirSync("published-app/windows/public", { recursive: true });
      // CopyFolder("public", "published-app/windows/public");


      // Exec("go build -o published-app/app");

      if (Verbose) console.log("Spindly Publish Finished");
      return null;

    },
  };
}



function copyFileSync(source, target) {

  var targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function CopyFolder(source, target) {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        CopyFolder(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

function Exec(file) {
  var exec = require('child_process').exec;

  return new Promise((resolve, reject) => {
    exec(file, function execcallback(error, stdout, stderr) {
      if (stdout) console.log(file + ': ' + stdout);
      if (stderr) console.log(file + ': Erro : ' + stderr);
      if (error) console.error(error);

      resolve();
    });
  });

}
