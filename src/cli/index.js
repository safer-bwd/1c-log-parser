import fs from 'fs';
import { Transform } from 'stream';
import program from 'commander';
import parser from './parse-stream';
import convert from './convert-steam';

program.option('-f, --file [path]', 'path to a log file');
program.option('-o, --out-file [path]', 'path to an output file');
program.option('-c, --config-file [path]', 'path to a config file');
program.parse(process.argv);

const errors = [];

if (program.file) {
  if (!fs.existsSync(program.file)) {
    errors.push(`File ${program.file} does not exist`);
  }
}

let options = {};
if (program.configFile) {
  if (!fs.existsSync(program.configFile)) {
    errors.push(`Config file ${program.configFile} does not exist`);
  } else {
    try {
      const content = fs.readFileSync(program.configFile, {
        encoding: 'utf8'
      });
      options = JSON.parse(content);
    } catch (err) {
      errors.push(`Failed to read config file: ${err}`);
    }
  }
}

if (errors.length > 0) {
  errors.forEach(e => console.error(` ${e}`));
  process.exit(2);
}

const transform = new Transform({
  transform(chunk, encoding, callback) {
    const records = parser.parse(chunk.toString());
    this.push(convert(records, options));
    callback();
  }
});

const readStream = program.file
  ? fs.createReadStream(program.file) : process.stdin;

const writeStream = program.outFile
  ? fs.createWriteStream(program.outFile) : process.stdout;

const startTime = Date.now();

readStream
  .pipe(transform)
  .pipe(writeStream)
  .on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    console.log(`Completed in ${duration} sec.`);
  });
