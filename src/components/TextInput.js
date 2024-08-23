import React, { useState } from 'react';
import '../styles/input.css';

const TextInput = ({ label, placeholder, error }) => {
    const [value, setValue] = useState('');

    return (
        <div className="input-group">
            <label>{label}</label>
            <input 
                type="text" 
                placeholder={placeholder} 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default TextInput;
