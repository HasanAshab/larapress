import Job from "~/core/abstract/Job";

export default class T2 extends Job {
  concurrency = 2
  
  constructor(private data: object = {}) {
    super();
    this.data = data;
  }
  
  async handle() {
    console.log(this.data)
   /* 
    await new Promise(resolve => {
      setTimeout(() => {
        console.log("fired2", this.data)
      resolve()
      }, 1500);
    });*/
    return "djdjd"
  }
}