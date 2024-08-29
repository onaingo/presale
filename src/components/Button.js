import React from 'react';
import '../styles/button.css';

const Button = ({ label, onClick, type = 'primary', className = '' }) => {
    return (
        <button className={`custom-button ${type} ${className}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
