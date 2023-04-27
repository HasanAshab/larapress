const Command = require(base('illuminate/commands/Command'));
const fs = require('fs');
const path = require('path');

class Clear extends Command {
  uploads = () => {
    const directory = storage('public/uploads');
    fs.readdirSync(directory).forEach((file) => {
      this.alert(`removing: ${file}...`);
      const filePath = path.join(directory, file);
      fs.unlink(filePath, (err) => {log(err)});
    });    
    this.success('Uploads are cleared now!');
  }
}


module.exports = Clear;