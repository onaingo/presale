const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Install necessary plugins
exec('npm install animate.css framer-motion @mui/material @emotion/react @emotion/styled', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error installing plugins: ${stderr}`);
        return;
    }
    console.log(stdout);
    console.log('Plugins installed successfully.');

    // Helper function to update file content efficiently
    const updateFile = (filePath, searchValue, replaceValue) => {
        if (!fs.existsSync(filePath)) return;
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(searchValue)) {
            content = content.replace(searchValue, replaceValue);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    };

    // Demo Modal Enhancements
    updateFile(
        './src/components/Modal.js',
        `className="close-button"`,
        `className="close-button custom-button secondary"`
    );
    updateFile(
        './src/components/Modal.js',
        `<div className="modal-overlay">`,
        `<div className="modal-overlay" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()} style={{ animation: "fadeIn 0.5s" }}>`
    );
    updateFile(
        './src/styles/modal.css',
        `.modal-overlay {`,
        `.modal-overlay { z-index: 9999; background-color: rgba(0, 0, 0, 0.7); }`
    );
    updateFile(
        './src/styles/modal.css',
        `.close-button {`,
        `.close-button { background-color: #dc3545; border: none; padding: 10px 15px; border-radius: 50%; cursor: pointer; color: white; transition: background-color 0.3s ease; }`
    );
    updateFile(
        './src/styles/modal.css',
        `.close-button:hover {`,
        `.close-button:hover { background-color: #c82333; transform: scale(1.1); }`
    );

    // Button Enhancements with Plugin
    updateFile(
        './src/components/Button.js',
        `className={\`custom-button \${type}\`}`,
        `className={\`custom-button \${type} animate__animated animate__pulse\`}`
    );

    // Accordion Animation and Arrow
    updateFile(
        './src/components/Accordion.js',
        `className="accordion-header"`,
        `className="accordion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={(e) => { setIsOpen(!isOpen); e.target.querySelector('.arrow').classList.toggle('open'); }}`
    );
    updateFile(
        './src/components/Accordion.js',
        `</div>`,
        `<span className="arrow ${isOpen ? 'open' : ''}">&#9660;</span></div>`
    );
    updateFile(
        './src/styles/accordion.css',
        `.accordion-body {`,
        `.accordion-body { transition: max-height 0.5s ease-in-out; overflow: hidden; max-height: ${isOpen ? '100px' : '0'}; }`
    );
    updateFile(
        './src/styles/accordion.css',
        `.arrow {`,
        `.arrow { transition: transform 0.3s ease; } .arrow.open { transform: rotate(-180deg); }`
    );

    // Toggle Button with Animation
    const toggleButtonJs = `
import React, { useState } from 'react';
import '../styles/toggleButton.css';
import { motion } from 'framer-motion';

const ToggleButton = () => {
    const [isOn, setIsOn] = useState(false);
    return (
        <motion.div 
            className="toggle-button" 
            onClick={() => setIsOn(!isOn)}
            whileTap={{ scale: 0.9 }}
            initial={{ backgroundColor: isOn ? '#28a745' : '#dc3545' }}
            animate={{ backgroundColor: isOn ? '#28a745' : '#dc3545' }}
        >
            <motion.div 
                className={\`knob \${isOn ? 'on' : 'off'}\`} 
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
            />
        </motion.div>
    );
};

export default ToggleButton;
`;
    const toggleButtonCss = `
.toggle-button { width: 60px; height: 30px; border-radius: 15px; position: relative; cursor: pointer; }
.knob { width: 28px; height: 28px; background-color: white; border-radius: 50%; position: absolute; top: 1px; }
.knob.on { left: 30px; }
.knob.off { left: 2px; }
`;
    fs.writeFileSync('./src/components/ToggleButton.js', toggleButtonJs);
    fs.writeFileSync('./src/styles/toggleButton.css', toggleButtonCss);

    // Pagination Enhancements with Plugin Animation
    updateFile(
        './src/components/Pagination.js',
        `className={\`page-item \${page === currentPage ? 'active' : ''}\`}`,
        `className={\`page-item \${page === currentPage ? 'active animate__animated animate__heartBeat' : ''}\`}`
    );
    updateFile(
        './src/styles/pagination.css',
        `.page-item {`,
        `.page-item { background-color: #007bff; color: white; padding: 10px 15px; border: 2px solid #007bff; border-radius: 4px; cursor: pointer; transition: background-color 0.3s ease; } .page-item:hover { background-color: #0056b3; border-color: #0056b3; }`
    );

    console.log('All updates applied successfully.');
});
