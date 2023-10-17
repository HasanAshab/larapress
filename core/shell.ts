import "reflect-metadata";
import "dotenv/config";
process.env.NODE_ENV = "shell";
import "~/vendor/autoload";
import Application from "~/core/Application";
import Artisan from 'Artisan';


const app = new Application();

const getValueWithRange = (start,end,str) =>{
    let value = ""
    while (str[start++] < end){
        value += str[start]
    }
    return {value,endIndex: end}
}
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
 let defaultValue = 'false'
 for (let i = 0; i < signature.length;i++){
   if (signature[i] === "-"){
   
    while ( signature[i] !== "}"){

    if (signature[i] === "=") {
      if (signature[++i] === "}"){
        defaultValue = null
      }else{
        defaultValue = ""
        while (signature[i] !== "}") defaultValue += signature[i++] 

      }
      break
    } 
    else if (signature[i] !== " ") currentFlag += signature[i++]
    }
     
       if (signature[i] !== "") {
          obj[currentFlag] = defaultValue
          currentFlag = ""
          defaultValue = "false"
        }
   

   }

 }
 
 return obj
}
const parse = (signature, list) => {
signature = signature.split(" ").join("")
const args = findSignatureKeys(signature)
const opts = findSignatureFlags(signature)


 
  const argumentValuesList = list.filter(item=> !item.startsWith("-"))
  let i = 0;
  for (const key in args){
    if (i < argumentValuesList.length) {
      args[key] = argumentValuesList[i++]
    }else{
      if (args[key] === "" ){
       throw new Error(`No argument passed for "${key}"`)
      }
   }
   
  }
 
  
  const argumentFlagsList = list.filter(item=>item.startsWith("-"))
  for (const key in opts){
   const flagTypes = key.slice(2).split("|")
   let index = 0 
  let current = (argumentFlagsList[index] !== undefined ? (argumentFlagsList[index].startsWith("--") ?  /\w+/.exec(argumentFlagsList[index])[0] : argumentFlagsList[index].slice(1,2)) : undefined)

     while (!flagTypes.includes(current) && ++index < argumentFlagsList.length){    
        current =  argumentFlagsList[index].startsWith("--") ?  /\w+/.exec(argumentFlagsList[index])[0] : argumentFlagsList[index].slice(1,2)
    }
      
  //completed    
  current = argumentFlagsList[index]  
 if (current === undefined) opts[flagTypes[1]] = opts[key]
 else{
   if (current.includes("=") || current.length > 2){
   opts[flagTypes[1]] = (current.startsWith("--") ? current.slice(current.indexOf("=") + 1) :    current.slice(2))
  }else{
  opts[flagTypes[1]] = 'true'
  }
 }
   delete opts[key]
 }


  return {
    args,opts
  }
}


const signature = "{a} {--B|ball} {c?} {--D|do=}"
parse(signature, process.argv.splice(2))

/*
const [baseInput, ...args] = process.argv.splice(2);
Artisan.call(baseInput, args)

process.on("taskDone", () => {
  process.exit(0);
});
*/
