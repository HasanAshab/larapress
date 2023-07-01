import Job from "illuminate/jobs/Job";

export default class T2 extends Job {
  shouldQueue = true;
  
  async dispatch(data){
    console.log("fired2", data)
  }
}