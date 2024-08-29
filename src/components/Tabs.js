import React, { useState, useEffect, useRef } from 'react';
import '../styles/tabs.css';

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].label);
    const [content, setContent] = useState(tabs[0].content);
    const [fadeState, setFadeState] = useState('fade-in');
    const [lineStyle, setLineStyle] = useState({});
    const tabRefs = useRef([]);

    useEffect(() => {
        const activeIndex = tabs.findIndex(tab => tab.label === activeTab);
        const activeTabRef = tabRefs.current[activeIndex];
        if (activeTabRef) {
            const { offsetWidth, offsetLeft } = activeTabRef;
            setLineStyle({
                width: `${offsetWidth}px`,
                left: `${offsetLeft}px`,
            });
        }
    }, [activeTab, tabs]);

    useEffect(() => {
        if (fadeState === 'fade-out') {
            const timeout = setTimeout(() => {
                setContent(tabs.find(tab => tab.label === activeTab).content);
                setFadeState('fade-in');
            }, 300); // 300ms delay to match the fade-out duration
            return () => clearTimeout(timeout);
        }
    }, [fadeState, activeTab, tabs]);

    const handleTabClick = (label) => {
        if (label !== activeTab) {
            setFadeState('fade-out');
            setActiveTab(label);
        }
    };

    return (
        <div className="tabs">
            <div className="tab-headers">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.label}
                        className={`tab-button ${activeTab === tab.label ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.label)}
                        ref={el => tabRefs.current[index] = el}
                    >
                        {tab.label}
                    </button>
                ))}
                <div className="active-tab-indicator" style={lineStyle}></div>
            </div>
            <div className="tab-content-wrapper">
                <div className="tab-background"></div>
                <div className={`tab-content ${fadeState}`}>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Tabs;
