const tsconfig = require('./tsconfig');
import path from 'path';
const { Command } = require('commander');

function resolvePath(tsPath) {
  const { outDir } = tsconfig.compilerOptions;
  const outPath = path.join(outDir, tsPath);
  return path.join(__dirname, outPath);
}

const artisan = new Command();
artisan
.name('Artisan')
.description('CLI for Express X Typescript project.\n Made by Samer Agency')
.version('0.0.1');

const commands = require(resolvePath('register/commands')).default;

for (const [name, actionPath] of Object.entries(commands)) {
  const ActionClass = require(resolvePath(actionPath)).default;
  const action = new ActionClass();
  const handler = action.handle;
  const arguments = getParams(handler);
  arguments.pop();

  const command = artisan.command(name).description(action.description || '')
  
  for(const argument of arguments){
    command.argument(`<${argument}>`);
  }
  
  for(const option of action.options){
    command.option(option.flag, option.message, option.default)
  }
  command.action(handler);
}

artisan.parse()

//artisan.parse([null, null, 'test', 'thats foo', 'thats bar', '-p', '30'])
//console.log(artisan.commands[0]._actionHandler(['hdbd', 'djsj']))

function getParams(func) {
  var str = func.toString();
  str = str.replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/(.)*/g, '')
  .replace(/{[\s\S]*}/, '')
  .replace(/=>/g, '')
    .trim();
    var start = str.indexOf("(") + 1;
    var end = str.length - 1;
    var result = str.substring(start, end).split(", ");
    var params = [];
    result.forEach(element => {
      element = element.replace(/=[\s\S]*/g, '').trim();
      if (element.length > 0)
        params.push(element);
    });

    return params;
}