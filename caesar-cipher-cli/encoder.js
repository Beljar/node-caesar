class Encoder {
  /**
  * Caesar encoder
  * @param {string} str - the input string
  * @param {number[][]} targetIntervals - array of intervals of encoding chars. Each interval should be represented as array of 2 numbers [starting ASCII code, finishing ASCII code]. Chars that do not belong to any interval will not be coded
  * @param {number} shift - how many letters to shift from every given char. eg: shift=2 a=>c, b=>d etc.
  */
  constructor(targetIntervals, shift) {
    this.targetIntervals = targetIntervals;
    this.shift = shift;
  }
  inInterval([min, max], val) {
    return ((val >= min) && (val <= max));
  }

  charShift(char) {
    for (let interval of this.targetIntervals) {
      if (this.inInterval(interval, char.charCodeAt())) {
        let intLen = interval[1] - interval[0] + 1;
        this.shift = ((this.shift % intLen) + intLen) % intLen;
        return String.fromCharCode((((char.charCodeAt() + this.shift) - interval[0]) % (interval[1] - interval[0] + 1)) + interval[0]);
      }

    }
    return char;
  }

  /**
   * Encode string
   * @param {string} str - the input string
   */
  encode(str) {
    return str.split("").map(chr => this.charShift(chr))
      .join("");
  }
}

module.exports = Encoder;