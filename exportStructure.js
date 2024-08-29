const fs = require('fs');
const path = require('path');

const outputFile = 'structure.txt';

const ignoredDirectories = ['node_modules', '.git'];

const getDirectoryStructure = (dir, prefix = '') => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        const isDirectory = entry.isDirectory();

        if (!ignoredDirectories.includes(entry.name)) {
            const formattedEntry = `${prefix}${entry.name}${isDirectory ? '/' : ''}`;
            fs.appendFileSync(outputFile, formattedEntry + '\n');

            if (isDirectory) {
                getDirectoryStructure(fullPath, prefix + '  ');
            }
        }
    });
};

const startDirectory = path.resolve(__dirname);
fs.writeFileSync(outputFile, ''); // Clear the file if it already exists
getDirectoryStructure(startDirectory);

console.log(`Directory structure has been exported to ${outputFile}`);
