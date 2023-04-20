const Command = require("./Command");
const componentPaths = require("../../register/componentPaths");
const fs = require("fs");
const path = require("path");

class Make extends Command {
  admin = (name, email, password) => {
    this.success('Admin account created successfully!');
  }
  
  
  handle = (name) => {
    try {
      var template = fs.readFileSync(
        path.join(__dirname, `../../templates/${this.subCommand}`),
        "utf-8"
      );
    } catch {
      return this.error("Component not available");
    }
    const content = template.replace(/{{name}}/g, name);
    const filepath = this._getPathFor(this.subCommand, name);
    fs.writeFileSync(filepath, content, { flag: "wx" });
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
    const filepath = `${componentPath}/${name}.js`;
    return filepath;
  };
}

module.exports = Make;
