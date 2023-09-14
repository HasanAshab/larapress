import Job from "~/core/abstract/Job";

export default class T2 extends Job {
  concurrency = 2;
  
  async handle(data: object) {
    await new Promise(resolve => {
      setTimeout(() => {
        console.log("fired2", data)
      resolve()
      }, 2500);
    });
  } 
  
}