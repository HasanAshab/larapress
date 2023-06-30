import Job from "illuminate/jobs/Job";
import ShouldQueue from "illuminate/queue/ShouldQueue";

export default class T extends Job implements ShouldQueue {
  queueChannel = "T";
  
  async dispatch(data){
    console.log("fired", data)
  }
}