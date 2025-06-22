const { exec } = require('child_process');
const path = require('path');

const executeCode = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filepath);
    let command = '';
    if (ext === '.cpp') {
      // Compile to exe in the same directory
      const dir = path.dirname(filepath);
      const exePath = path.join(dir, path.basename(filepath, '.cpp') + '.exe');
      command = `g++ "${filepath}" -o "${exePath}" && "${exePath}" < "${inputPath}"`;
    } else if (ext === '.java') {
      const dir = path.dirname(filepath);
      command = `javac "${filepath}" && java -cp "${dir}" Main < "${inputPath}"`;
    } else if (ext === '.py') {
      command = `python3 "${filepath}" < "${inputPath}"`;
    } else {
      return reject(new Error('Unsupported language'));
    }
    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error);
      }
      resolve(stdout);
    });
  });
};

module.exports = executeCode;