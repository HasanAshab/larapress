import Command from "~/core/abstract/Command";
import { exec } from "child_process";

export default class CommitProject extends Command {
  private steps = [
    'git add .',
    'git commit -m "backup"',
    'git push'
  ];

  async handle(){
    const { stdout, stderr } = await exec(this.steps.join(" & "));
    if(stderr) {
      this.info(stderr);
    }
    this.info(stdout);
    this.success("Project backup created successfully");
  }
}