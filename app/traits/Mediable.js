const Media = model('Media');
const Storage = util('Storage');

module.exports = schema => {
  schema.methods.files = async function() {
    return await Media.find({
      mediableId: this._id,
      mediableType: this.constructor.modelName
    });
  }


  schema.methods.attachFile = async function(name, file) {
    const path = Storage.putFile('public/uploads', file);
    const media = new Media({
      name,
      mediableId: this._id,
      mediableType: this.constructor.modelName,
      mimetype: file.mimetype,
      path
    });
    media.link = route('file.serve', {id:media._id});
    media.save().then();
    this.media.push(media._id);
    this.save().then();
  }

  schema.methods.attachFiles = function(files) {
    for (name of Object.keys(files)){
      const path = Storage.putFile('public/uploads', files[name]);
      const media = new Media({
        name,
        mediableId: this._id,
        mediableType: this.constructor.modelName,
        mimetype: file.mimetype,
        path
      });
      media.link = route('file.serve', {id:media._id});
      media.save().then();
      this.media.push(media._id);
    }
    this.save().then();
  }
  
  schema.methods.getFilesByName = async function(name) {
    return await Media.find({name, mediableId: this._id});
  }
  
}