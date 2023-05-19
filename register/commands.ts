type SignatureNamePair = {[key: string]: string};

const commands: {nested?: SignatureNamePair, invoked?: SignatureNamePair} = {
//const commands: {[key: string]: string} = {
  /*
  secret: "GenerateSecret",
    doc: "GenerateDoc",
    seed: "Seed",
    make: "Make",
  */
  //clear: "Clear",
  nested: {
    test: "Test",
  }
}

export default commands;