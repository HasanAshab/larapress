import Job from "~/core/abstract/Job";

export default class T1 extends Job {
  async handle(data: object){
    console.log(data)
  }
}