const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'output');

if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = (filepath) => {
    const jobId = path.basename(filepath).split('.')[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        const ext = path.extname(filepath);
        let command = '';
        
        if (ext === '.cpp') {
            const output = filepath.replace('.cpp', '');
            command = `g++ "${filepath}" -o "${output}" && "${output}"`;
        } else if (ext === '.java') {
            // For Java 11+, we can run .java files directly
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