const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Helper function to recursively read all files in a directory
const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(file => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
};

// Combine all files in the src directory
const combineFiles = () => {
    const srcPath = path.join(__dirname, 'src');
    const outputPath = path.join(__dirname, 'flattenedSource.txt');

    const files = getAllFiles(srcPath);

    let combinedContent = '';

    files.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(__dirname, file);
        
        combinedContent += `\n\n==== START OF FILE: ${relativePath} ====\n`;
        combinedContent += fileContent;
        combinedContent += `\n==== END OF FILE: ${relativePath} ====\n`;
    });

    fs.writeFileSync(outputPath, combinedContent, 'utf8');
    console.log(`All files have been combined into ${outputPath}`);
    
    // Commit and push changes to Git
    exec('git add . && git commit -m "Updated flattenedSource.txt" && git push', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error during Git operations: ${stderr}`);
            return;
        }
        console.log(stdout);
        console.log('Changes committed and pushed to GitHub.');
    });
};

combineFiles();
