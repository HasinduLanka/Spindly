import { SpindlyMake } from "./spindlymake.js";


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
  };
}