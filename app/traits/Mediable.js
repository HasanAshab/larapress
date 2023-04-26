const mongoose = require("mongoose");
const Media = require(base("app/models/Media"));
const Storage = require(base("utils/Storage"));

module.exports = schema => {
  schema.add({
    media: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    }],
  });
  
  schema.methods.files = async function () {
    return await Media.find({
      mediableId: this._id,
      mediableType: this.constructor.modelName,
    });
  }

  schema.methods.attachFile = async function (name, file, attachLinkToModel = false) {
    const path = Storage.putFile("public/uploads", file);
    const media = new Media({
      name,
      mediableId: this._id,
      mediableType: this.constructor.modelName,
      mimetype: file.mimetype,
      path,
    });
    const link = route("file.serve", { id: media._id });
    media.link = link;
    await media.save();
    if(attachLinkToModel){
      this[`${name}Url`] = link;
    }
    this.media.push(media._id);
    await this.save();
    return media;
  }

  schema.methods.attachFiles = async function (files, attachLinkToModel) {
    const allMedia = [];
    for (name of Object.keys(files)) {
      const path = Storage.putFile("public/uploads", files[name]);
      const media = new Media({
        name,
        mediableId: this._id,
        mediableType: this.constructor.modelName,
        mimetype: file.mimetype,
        path,
      });
      media.link = route("file.serve", { id: media._id });
      await media.save();
      this.media.push(media._id);
      allMedia.push(media);
      if(attachLinkToModel){
        this[`${name}Url`] = link;
      }
    }
    await this.save();
    return allMedia;
  }

  schema.methods.getFilesByName = async function (name) {
    return await Media.find({
        name,
        mediableType: this.constructor.modelName,
        mediableId: this._id,
      });
  }

  schema.methods.removeFiles = async function (name = null) {
    if(!name){
      return await Media.deleteMany({
        mediableType: this.constructor.modelName,
        mediableId: this._id,
      });
    }
    return await Media.deleteMany({
      name,
      mediableType: this.constructor.modelName,
      mediableId: this._id,
    });
  }

  schema.methods.removeFile = async function (_id) {
    return await Media.deleteOne({_id});
  }

}
