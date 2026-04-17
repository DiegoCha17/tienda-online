const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const original = content;
            
            content = content.replace(/trangray-/g, 'translate-');
            content = content.replace(/transtone-/g, 'translate-'); // Just in case
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed translate in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));
console.log('Done fixing translate typos!');
