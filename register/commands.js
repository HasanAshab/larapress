// Register all commands here
commands = {
  invoked: {
    //
  },
  
  nested: {
    'make': './app/commands/Make',
    'secret': './app/commands/GenerateSecret',
    'clear': './app/commands/Clear',
  }
}

module.exports = commands;