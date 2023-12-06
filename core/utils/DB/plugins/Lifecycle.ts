import { Schema, Document, Model } from "mongoose";
import Emittery from 'emittery';

Schema.prototype._lifecycle = new Emittery;
  
Schema.prototype.before = function(event: string, listener) {
  this._lifecycle.on(event + ".before", listener);
}
  
Schema.prototype.after = function(event: string, listener) {
  this._lifecycle.on(event + ".after", listener);
}

const { create } = Model;

Model.create = async function(...args) {
  await this.schema._lifecycle.emit("create.before", args[0]);
  const document = await create.apply(this, args);
  await this.schema._lifecycle.emit("create.after", document);
  return document;
}


/**
 * Plugin to add model lifecycle events
*/
export default function Lifecycle(schema: Schema) {
  schema.statics.before = function(event: string, listener) {
    this.schema._lifecycle.on(event + ".before", listener);
  }
  
  schema.statics.after = function(event: string, listener) {
    this.schema._lifecycle.on(event + ".after", listener);
  }
  
  schema.statics.observe = function() {
    
  }
    
}
