export default abstract class Factory {
  merge(data?: object): object {
    const modelData = this.definition();
    if(typeof data === "undefined"){
      return modelData;
    }
    for (const field of Object.keys(data)){
      modelData[field] = data[field];
    }
    return modelData;
  };
}