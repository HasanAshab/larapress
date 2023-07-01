import Job from "illuminate/jobs/Job";

export default class T extends Job implements ShouldQueue {
  async dispatch(data){
    console.log("fired", data)
  }
}