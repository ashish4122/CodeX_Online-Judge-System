const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'output');

if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = (filepath, inputPath) => {
    console.log(filepath);
    if (typeof filepath !== 'string') {
        throw new TypeError('The "filepath" argument must be a string');
    }
    const jobId = path.basename(filepath).split('.')[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        const ext = path.extname(filepath);
        let command = '';
        
        if (ext === '.cpp') {
            const exePath = path.join(outputPath, `${jobId}.exe`);
            command = `g++ "${filepath}" -o "${exePath}" && "${exePath}" < "${inputPath}"`;
        } else if (ext === '.java') {
            command = `java "${filepath}"`;
        } else if (ext === '.py') {
            command = `python3 "${filepath}"`;
        } else {
            return reject(new Error('Unsupported language'));
        }
        
        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
            } else {
                resolve(stdout || 'No output');
            }
        });
    });
};

module.exports = executeCode;