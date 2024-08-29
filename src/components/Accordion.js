import React, { useState, useRef, useEffect } from 'react';
import '../styles/accordion.css';

const AccordionItem = ({ title, children, isOpen, onClick }) => {
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = isOpen
                ? `${contentRef.current.scrollHeight}px`
                : '0px';
            contentRef.current.style.paddingTop = isOpen ? '15px' : '0px';
            contentRef.current.style.paddingBottom = isOpen ? '15px' : '0px';
            contentRef.current.style.opacity = isOpen ? '1' : '0'; // Ensure smooth opacity transition
        }
    }, [isOpen]);

    return (
        <div className="accordion-item">
            <div className="accordion-header" onClick={onClick}>
                {title}
                <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
            </div>
            <div
                ref={contentRef}
                className={`accordion-body ${isOpen ? 'open' : ''}`}
            >
                {children}
            </div>
        </div>
    );
};

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="accordion">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onClick={() => handleClick(index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;
