import Job from "~/core/abstract/Job";
import Artisan from "Artisan";

export default class CallConsoleCommand extends Job {
  concurrency = 1;
  
  async handle(command: string) {
    const [ base, ...args ] = command.split(" ");
    await Artisan.call(base, args);
  }
}