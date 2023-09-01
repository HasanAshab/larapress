import Job from "~/core/jobs/Job";

export default class T2 extends Job {
  shouldQueue = true;
  concurrency = 3
  
  async dispatch(data: object){
    console.log("fired2", data)
  }
}