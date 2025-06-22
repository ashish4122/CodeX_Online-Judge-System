const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

// Map language to correct file extension
const extensionMap = {
    cpp: 'cpp',
    java: 'java',
    python: 'py'
};

const generateFile = (language, content) => {
    let filename;
    if (language === 'java') {
        filename = 'Main.java'; // Always use Main.java for Java
    } else {
        const jobID = uuid();
        const ext = extensionMap[language];
        if (!ext) throw new Error('Unsupported language for file generation');
        filename = `${jobID}.${ext}`;
    }
    const filePath = path.join(dirCodes, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = generateFile;