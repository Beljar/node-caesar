const { Transform } = require('stream');

const Encoder = require('./encoder');

class EncodeStream extends Transform{
  constructor(shift, targetIntervals){
    super();
    this.encoder = new Encoder(targetIntervals, shift);
  }
  _transform(chunk, enc, done){
    this.push(this.encoder.encode(chunk.toString()));
    done();
  }
}

module.exports = EncodeStream;