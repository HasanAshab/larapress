import Job from "~/core/abstract/Job";

export default class T2 extends Job {
  concurrency = 2;
  tries = 3;

  async handle(data: object) {
    console.log("fired1", data)
    await new Promise(resolve => {
      setTimeout(() => {
        console.log("fired2", data)
      resolve("done")
      }, 2500);
    });
  } 
  
}