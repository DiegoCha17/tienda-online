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
            
            // Replace slate with stone for a more neutral/bone look
            content = content.replace(/slate-/g, 'stone-');
            
            // Also, replace some bg-white with bg-stone-50 for slightly softer "hueso" cards, 
            // but carefully... let's just do slate -> stone for now to fix the dark mode / borders
            // and maybe bg-white to bg-stone-50 if it's the main background, but since we updated globals.css
            // --background to stone-100, the main bg is already bone color.
            
            // If the user wants the cards to also be "bone gray", we can change bg-white to bg-stone-50.
            content = content.replace(/bg-white/g, 'bg-stone-50');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));
console.log('Done!');
