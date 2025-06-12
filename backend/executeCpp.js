const { exec } = require('child_process');
const path = require('path');

const executeCode = (filepath) => {
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

module.exports = { executeCode };