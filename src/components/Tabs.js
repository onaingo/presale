import React, { useState } from 'react';
import '../styles/tabs.css';;

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    return (
        <div className="tabs">
            <div className="tab-headers">
                {tabs.map((tab) => (
                    <button 
                        key={tab.label} 
                        className={`tab-button ${activeTab === tab.label ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.label)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.find((tab) => tab.label === activeTab)?.content}
            </div>
        </div>
    );
};

export default Tabs;
