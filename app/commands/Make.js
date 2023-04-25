const Command = require(base('app/commands/Command'));
const User = require(base('app/models/User'));
const componentPaths = require(base('register/componentPaths'));
const fs = require('fs');
const path = require('path');

class Make extends Command {
  admin = async (name, email, password) => {
    await this.connect();
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: true,
      emailVerified: true,
    });
    this.success('Admin account created successfully!');
  }
  
  test = (name, type){
    console.log(name, type)
  }
  
  handle = (name) => {
    try {
      var template = fs.readFileSync(base(`templates/${this.subCommand}`), 'utf-8');
    } catch {
      this.error('Component not available');
    }
    const content = template.replace(/{{name}}/g, name);
    const filepath = this._getPathFor(this.subCommand, name);
    fs.writeFileSync(filepath, content, { flag: 'wx' });
    this.success(`File created successfully: [${filepath}]`);
  };

  _loadDir = (path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  };

  _getPathFor = (componentName, name) => {
    const componentPath = componentPaths[componentName];
    this._loadDir(componentPath);
    return path.join(componentPath, `${name}.js`);
  };
}

module.exports = Make;
