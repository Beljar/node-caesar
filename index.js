/* const fs = require('fs').promises; */
const readline = require('readline');
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);
const {program} = require('commander');
const { Transform, Readable } = require('stream');
const { rawListeners } = require('process');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', (input) => {
  rl.close();
});

ASCIILowerCodes = [97, 122];
ASCIIUpperCodes = [65, 90];

function inInterval([min, max], val){
  return ((val >= min) && (val <= max));
}

function charShift(char, targetIntervals, shift){
for (interval of targetIntervals){
  if (inInterval(interval, char.charCodeAt())){
    let intLen = interval[1] - interval[0] + 1;
    shift = ((shift % intLen) + intLen) % intLen;
    return String.fromCharCode((((char.charCodeAt() + shift) - interval[0]) % (interval[1] - interval[0] + 1)) + interval[0]);
  }

}
  return char;
}

function encode(str, shift){
return str.split("").map(chr => charShift(chr, [ASCIILowerCodes, ASCIIUpperCodes], shift))
.join("");
}

class encoder extends Transform{
  constructor(shift){
    super();
    this.shift = shift;

  }
  _transform(chunk, enc, done){
    this.push(encode(chunk.toString(), this.shift));
    done();
  }
}

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

await pipeline(
  program.input ? fs.createWriteStream(program.input) : process.stdin,
  new encoder(shift),
  fs.createWriteStream(program.output)
)}

//main().catch(console.error);

main().then(
  () => console.log(`${program.action} success`),
  (err) => console.log(`${program.action} failed \n ${err}`)
);

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