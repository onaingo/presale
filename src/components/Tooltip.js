import React from 'react';
import '../styles/tooltip.css';

const Tooltip = ({ text, children }) => {
    return (
        <div className="tooltip-container">
            {children}
            <span className="tooltip-text">{text}</span>
        </div>
    );
};

export default Tooltip;
