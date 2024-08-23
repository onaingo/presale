
import React from 'react';
import '../styles/button.css';

const Button = ({ label, onClick, type = 'primary' }) => {
    return (
        <button className={`custom-button ${type} animate__animated animate__pulse`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
