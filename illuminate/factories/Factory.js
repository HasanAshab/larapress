class Factory {
  merge = (data) => {
    const modelData = this.definition();
    if(!data){
      return modelData;
    }
    for (const field of Object.keys(data)){
      modelData[field] = data[field];
    }
    return modelData;
  };
}

module.exports = Factory;