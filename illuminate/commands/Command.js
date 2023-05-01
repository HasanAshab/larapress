const ArtisanError = require(base("app/exceptions/ArtisanError"));

class Command {
  requiredParams(requiredParamsName){
    for(const name of requiredParamsName){
      if(typeof this.params[name] === 'undefined'){
        new ArtisanError().throw('REQUIRED_PARAM_MISSING', name);
      }
    }
    return true;
  }

  alert(text){
    console.log('\x1b[33m', text, '\x1b[0m');
  }

  success(text){
    console.log('\x1b[32m', '\n', text, '\n', '\x1b[0m');
    if(this.fromShell){
      process.exit(0);
    }
  }

  error(text){
    console.log('\x1b[31m', '\n', text, '\n', '\x1b[0m');
    if(this.fromShell){
      process.exit(0);
    }
  }
}

module.exports = Command;
