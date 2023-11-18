import { Command } from "samer-artisan";

export default class DeleteDatabaseIndexes extends Command {
 /**
  * The name and signature of the console command.
  */
  signature = "command signature";
  
 /**
  * The console command description.
  */
  description = "command description";
  
 /**
  * Execute the command
  */
  handle() {
    Blog.collection.dropIndexes(function (err, results) {
console.log(results)
    
  });
  
    this.info("DeleteDatabaseIndexes command works!");
  }
}