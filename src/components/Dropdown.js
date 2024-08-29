import React, { useState } from 'react';
import '../styles/dropdown.css';

const Dropdown = ({ options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="dropdown">
            <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
                {selected}
                <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
            </button>
            <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                {options.map((option, index) => (
                    <li
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={option === selected ? 'selected' : ''}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
