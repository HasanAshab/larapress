const Command = require(base("illuminate/commands/Command"));
const DB = require(base("illuminate/utils/DB"));
const User = require(base("app/models/User"));
const componentPaths = require(base("register/componentPaths"));
const fs = require("fs");
const path = require("path");

class Make extends Command {
  admin = async () => {
    this.requiredFlags(['name', 'email', 'password']);
    const { name, email, password } = this.flags;
    await DB.connect();
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: true,
      emailVerified: true,
    });
    this.success("Admin account created successfully!");
  };

  handle = (name) => {
    try {
      var template = this._getTemplate(name);
      var content = template.replace(/{{name}}/g, name);
      var filepath = this._getPath(this.subCommand, name);
    } catch {
      this.error("Component not available");
    }
    try {
      fs.writeFileSync(base(filepath), content, { flag: "wx" });
    } catch {
      this.error("Component already exist!");
    }
    this.success(`File created successfully: [${filepath}]`);
  };

  _loadDir(dir){
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  };

  _getTemplate(name){
    const path = this.hasFlag("type")
      ? base(`illuminate/templates/${this.subCommand}/${this.flags.type}`)
      : base(`illuminate/templates/${this.subCommand}`);
    return fs.readFileSync(path, "utf-8");
  };

  _getPath(componentName, name){
    const pathSchema = this.hasFlag("type")
      ? componentPaths[componentName][this.flags.type]
      : componentPaths[componentName];
    const componentPath = pathSchema.replace("{{name}}", name);
    this._loadDir(path.dirname(componentPath));
    return componentPath;
  };
}

module.exports = Make;
