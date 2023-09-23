import "reflect-metadata";
import "dotenv/config";
process.env.NODE_ENV = "shell";
//import Artisan from 'Artisan';


class CommandParser {
  constructor(commandSignature) {
    this.commandSignature = commandSignature;
    this.args = [];
    this.options = {};
    this.parseSignature();
  }

  parseSignature() {
    const parts = this.commandSignature.split(' ');

    let currentArg = null;
    let currentOption = null;

    parts.forEach(part => {
      if (part.startsWith('{') && part.endsWith('}')) {
        // It's an argument
        const argName = part.slice(1, -1);
        currentArg = { name: argName, optional: argName.endsWith('?') };
        this.args.push(currentArg);
      } else if (part.startsWith('--')) {
        // It's an option
        const optionName = part.slice(2);
        currentOption = { name: optionName, value: false };
        this.options[optionName] = currentOption;
      } else if (currentOption) {
        // It's the value of the current option
        currentOption.value = part;
        currentOption = null;
      }
    });
  }

  parse(argsAndOptions) {

    const parsedArgs = {};
    const parsedOptions = {};

    let currentArgIndex = 0;

    argsAndOptions.forEach(argOrOption => {
      if (argOrOption.startsWith('-')) {
        // It's an option
        const optionName = argOrOption.slice(1);
        const option = this.options[optionName];
        if (option) {
          parsedOptions[optionName] = option.value || true;
        }
      } else {
        // It's an argument
        const currentArg = this.args[currentArgIndex];
        if (currentArg) {
          parsedArgs[currentArg.name] = argOrOption;
          currentArgIndex++;
        }
      }
    });

    return { args: parsedArgs, options: parsedOptions };
  }
}

const commandSignature = 'myCommand {arg1} {arg2?} {--option1} {--option2=}';
const parser = new CommandParser(commandSignature);

const parsed = parser.parse(process.argv.splice(2));
console.log(parsed);

