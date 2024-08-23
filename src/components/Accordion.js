
import React, { useState } from 'react';
import '../styles/accordion.css';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="accordion">
            <div className="accordion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={(e) => { setIsOpen(!isOpen); e.target.querySelector('.arrow').classList.toggle('open'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={(e) => { setIsOpen(!isOpen); e.target.querySelector('.arrow').classList.toggle('open'); }} onClick={() => setIsOpen(!isOpen)}>
                {title}
            </div>
            {isOpen && <div className="accordion-body">{children}</div>}
        </div>
    );
};

export default Accordion;
