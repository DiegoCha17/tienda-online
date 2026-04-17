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
            
            // Remove all dark mode tailwind classes (e.g. dark:bg-gray-900, dark:text-white)
            content = content.replace(/dark:[^\s"'}]+/g, '');
            // Clean up double spaces left behind
            content = content.replace(/\s{2,}/g, ' ');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));
console.log('Removed all dark mode classes for a strictly light interface!');
