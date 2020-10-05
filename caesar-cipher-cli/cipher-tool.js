/* const fs = require('fs').promises; */

const fs = require('fs');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);

const EncodeStream = require('./Encode-stream');
const constructInterface = require('./constructInterface');
const argParse = require('./argParse');
const { program } = require('commander');

ASCIILowerCodes = [97, 122];
ASCIIUpperCodes = [65, 90];

const interface = constructInterface();
const args = argParse();

async function main() {

  //Checking input arguments
  if (program.action != "encode" && program.action != "decode") {
    console.error("Action not defined or unexpected value: specify action argument -a <encode/decode>");
    process.exit(1);
  }

  //Set up shif value 
  let shift = Number(args.shift);
  if (shift) {
    //if action decode set shift negative
    if (args.action == "decode") {
      shift = - Number(args.shift);
    }
  }
  //if shift omitted raise error and exit
  else {
    console.error("Shift not defined or unexpected value: specify shift argument -s <int>")
    interface.close();
    process.exit(1);
  }

  //if output path is specified 
  if (args.output) {
    try {
      //check if output path accessible
      fs.accessSync(args.output);
    }
    catch (err) {
      console.error(`${args.action} failed \n${err}`)
      interface.close();
      process.exit(1);
    }
  }

  await pipeline(
    args.input ? fs.createReadStream(args.input) : interface.input,
    new EncodeStream(shift, [ASCIILowerCodes, ASCIIUpperCodes]),
    args.output ? fs.createWriteStream(args.output, { flags: "a" }) : interface.output
  )
}

main().then(
  () => {
    console.log(`${args.action} success`);
    interface.close();
    process.exit(0);
  },
  (err) => {
    console.error(`${args.action} failed \n${err}`);
    interface.close();
    process.exit(1);
  }
);
