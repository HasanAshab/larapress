/*export default class ArgumentParser {
  
}
*/
const findSignatureKeys = (str) => {
  const obj = {};
  let i = 0;
  let currentKey = "";
  let defaultValue = "";
  while (i < str.length) {
    if (str[i++] === "{") {

      while (str[i] !== "}") {
     
      if (str[i] === "-") {
         while (str[i] !== "}") i++ 
         break
        }
      else if (str[i] === "?"){ 
          defaultValue = null
        }

        else if (str[i] === "=") {
         i++
         while (str[i] !== "}") defaultValue += str[i++]
          i--  
        }

        else currentKey += str[i]
        i++
      }
      if (currentKey.length > 0) {

        obj[currentKey] = defaultValue
        currentKey = ""
        defaultValue = ""
      }
    }
  }
  return obj
}

const findSignatureFlags = (signature)=>{
 const obj = {};
 
 let currentFlag = ""
 let defaultValue = false
 for (let i = 0; i < signature.length;i++){
   if (signature[i] === "-"){
   
    while ( signature[i] !== "}"){

    if (signature[i] === "=") {
        currentFlag += "="
      if (signature[++i] === "}"){
        defaultValue = null
      }else{
        defaultValue = ""
        while (signature[i] !== "}") defaultValue += signature[i++] 

      }
      break
    } 
    else currentFlag += signature[i++]
    }
     
       if (signature[i] !== "") {
          obj[currentFlag] = defaultValue
          currentFlag = ""
          defaultValue = false
        }
   

   }

 }
 
 return obj
}

const addValueOfKeys = (list,obj)=>{
     const Values = list.filter(item=> !item.startsWith("-"))
  let i = 0;
  for (const key in obj){
    if (i < Values.length) {
      obj[key] = Values[i++]
    }else{
      if (obj[key] === "" ){
       throw new Error(`No argument passed for "${key}"`)
      }
   }
   
  }
}

const addValueOfFlags = (list,obj)=>{
    const flags = list.filter(item=>item.startsWith("-"))
  for (const key in obj){
   const flagTypes = key.slice(2).split(/\W/)
   let index = 0 
   let current = (flags[index] !== undefined ? (flags[index].startsWith("--") ?  /\w+/.exec(flags[index])[0] : flags[index].slice(1,2)) : undefined)

     while (!flagTypes.includes(current) && ++index < flags.length){    
        current =  flags[index].startsWith("--") ?  /\w+/.exec(flags[index])[0] : flags[index].slice(1,2)
    }
      
  current = flags[index]  
 if (current === undefined){ 
     obj[flagTypes[1]] = obj[key]
 }else{
   if (key.includes("=") && (current.includes("=") || current.length > 2)){
   obj[flagTypes[1]] = (current.startsWith("--") ? current.slice(current.indexOf("=") + 1) :    current.slice(2))
  }else if (key.includes("=")){
      //Error: value has not passed
      throw new Error(`Value has not passed for the flag '${key.slice(0,key.length - 2)}' which is required`)
  } else obj[flagTypes[1]] = true
  }
 
   delete obj[key]
 }
}



export default function parse(signature, list) {
  signature = signature.split(" ").join("")
  const args = findSignatureKeys(signature)
  addValueOfKeys(list, args)

  const opts = findSignatureFlags(signature)
  addValueOfFlags(list,opts)

  return {
    args,opts
  }
}