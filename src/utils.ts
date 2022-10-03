const fs = require('fs');
const util = require('util');
const log_file = fs.createWriteStream('debug.log', {flags: 'w'});
const log_stdout = process.stdout;

export const log = function (d: string) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
export const debugLog = console.error;
export const prettify = (obj: any) => JSON.stringify(obj, null, 2);
export const prettyPrint = (obj: any) => log(prettify(obj));
