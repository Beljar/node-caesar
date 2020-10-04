/* const fs = require('fs').promises; */
const readline = require('readline');
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);
const {program} = require('commander');
const { Transform, Readable } = require('stream');
const { rawListeners } = require('process');

const EncodeStream = require('./encode-stream')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on('line', (input) => {
  //console.log(input);
  rl.pause();
  if (input == ""){
    //rl.clearLine(rl.output, 0)
rl.close();
  }
  else{
    rl.resume();
  }
  
});

rl.on("close", () => process.exit(1));

ASCIILowerCodes = [97, 122];
ASCIIUpperCodes = [65, 90];




async function main(){

program.storeOptionsAsProperties(true);

program.option("-s,--shift <int>", "cipher shift")
.option("-i,--input <file path>","input file path")
.option("-o,--output <file path>","output file path")
.option("-a,--action <action>","encode/decode");

program.parse(process.argv);
console.log(program.shift);
console.log(program.input);
console.log(program.action == "decode");

let shift;
if (program.action == "encode"){
  shift = Number(program.shift);
}
else if (program.action == "decode"){
  shift = - Number(program.shift);
}
else{
  console.log("Action not defined");
  return;
}

const inStream = new Readable({
  read() {
    
  
  }
});
rl.input.setRawMode(false);

if(program.output){
  try {
  fs.accessSync(program.output);
}
catch (err){
console.error(`${program.action} failed \n${err}`)
rl.close();
process.exit(1);
}}

await pipeline(
  program.input ? fs.createReadStream(program.input) : rl.input,
  new EncodeStream(shift, [ASCIILowerCodes, ASCIIUpperCodes]),
  program.output ? fs.createWriteStream(program.output, {flags:"a"}) : rl.output
)}

//main().catch(console.error);

main().then(
  
  () => {
    console.log(`${program.action} success`);
    rl.close();
    
},
  (err) => {
    
    console.error(`${program.action} failed \n${err}`);
    rl.close();
  }
);
//rl.close();
/* fs.readFile(program.input)
.then(content => {
  let shift;
  if (program.action == "encode"){
    shift = Number(program.shift);
  }
  else if (program.action == "decode"){
    shift = - Number(program.shift);
  }
  else{
    console.log("Action not defined");
    return;
  }
  fs.writeFile(program.output, (encode(content.toString(), shift)))
})
.catch(console.error); */

//console.log(encode('This is secret. Message about "_" symbol!', 7));
//console.log((encode('This is secret. Message about "_" symbol!', 7)) == 'Aopz pz zljyla. Tlzzhnl hivba "_" zftivs!');