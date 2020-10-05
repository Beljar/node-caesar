const readline = require('readline');

function constructInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', (input) => {
    rl.pause();
    if (input == "") {
      rl.close();
    }
    else {
      rl.resume();
    }
  });
  rl.on("close", () => process.exit(1));
  rl.input.setRawMode(false);
  return rl;
}

module.exports = constructInterface;