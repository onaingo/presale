import React, { useState } from 'react';
import '../styles/tooltip.css';

const Tooltip = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    const showTooltip = () => setIsVisible(true);
    const hideTooltip = () => setIsVisible(false);

    return (
        <div 
            className="tooltip-container"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {isVisible && (
                <div className="tooltip-text">
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
