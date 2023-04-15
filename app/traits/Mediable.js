const Media = model('Media');
const Storage = util('Storage');

module.exports = schema => {
  schema.methods.media = async function() {
    return await Media.find({
      mediableId: this._id,
      mediableType: this.constructor.modelName
    });
  }


  schema.methods.attachFile = function(name, file) {
    const path = Storage.putFile('public/uploads', file);
    Media.create({
      name,
      mediableId: this._id,
      mediableType: this.constructor.modelName,
      mimetype: file.mimetype,
      path
    }).then();
  }

  schema.methods.attachFiles = function(files) {
    //
  }
}