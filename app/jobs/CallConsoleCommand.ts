import Job from "~/core/abstract/Job";
import Artisan from "Artisan";

export default class CallConsoleCommand extends Job {
  concurrency = 1;
  
  async handle({ command }: object) {
    await Artisan.call(command);
  }
}