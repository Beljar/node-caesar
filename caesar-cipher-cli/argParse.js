const { program } = require('commander');

function argParse() {
  program.storeOptionsAsProperties(true);
  program.option("-s,--shift <int>", "cipher shift")
    .option("-i,--input <file path>", "input file path")
    .option("-o,--output <file path>", "output file path")
    .option("-a,--action <action>", "encode/decode");
  program.parse(process.argv);
  return program
}

module.exports = argParse;