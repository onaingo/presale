import React, { useState } from 'react';
import Button from '../components/Button';
import Slider from '../components/Slider';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import LoadingAnimation from '../components/LoadingAnimation';
import TextInput from '../components/TextInput';
import Modal from '../components/Modal';
import Tooltip from '../components/Tooltip';
import Dropdown from '../components/Dropdown';
import { ToastContainer, showToast } from '../components/Toast';
import ProgressBar from '../components/ProgressBar';
import Accordion from '../components/Accordion';
import Pagination from '../components/Pagination';
import '../styles/theme.css';

const DemoPage = () => {
    const [sliderValue, setSliderValue] = useState(50);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Option 1');
    const [currentPage, setCurrentPage] = useState(1);
    const accordionItems = [
        { title: "First Item", content: <p>This is the content for the first item.</p> },
        { title: "Second Item", content: <p>This is the content for the second item.</p> },
        { title: "Third Item", content: <p>This is the content for the third item.</p> }
    ];

    return (
        <div className="wrapper">
            <Header title="Demo UI Components" />

            <h2>Buttons</h2>
            <Button label="Primary Button" onClick={() => alert('Button clicked!')} type="primary" />
            <Button label="Secondary Button" onClick={() => alert('Button clicked!')} type="secondary" />

            <h2>Slider and Progress Bar</h2>
            <Slider min={0} max={100} value={sliderValue} onChange={(e) => setSliderValue(e.target.value)} />
            <ProgressBar progress={sliderValue} />
            <p>Slider Value: {sliderValue}</p>

            <h2>Tabs</h2>
            <Tabs tabs={[
                { label: 'Tab 1', content: <p>This is content for Tab 1.</p> },
                { label: 'Tab 2', content: <p>This is content for Tab 2.</p> },
                { label: 'Tab 3', content: <p>This is content for Tab 3.</p> },
            ]} />

            <h2>Loading Animation</h2>
            <LoadingAnimation />

            <h2>Text Input</h2>
            <TextInput label="Your Name" placeholder="Enter your name" />

            <h2>Modal</h2>
            <Button label="Open Modal" onClick={() => setIsModalOpen(true)} type="primary" />
            <Modal isOpen={isModalOpen} title="Demo Modal" onClose={() => setIsModalOpen(false)}>
                <p>This is a modal window content.</p>
            </Modal>

            <h2>Tooltip</h2>
            <Tooltip text="This is a tooltip!">
                <Button label="Hover over me" type="primary" />
            </Tooltip>

            <h2>Dropdown</h2>
            <Dropdown options={['Option 1', 'Option 2', 'Option 3']} selected={selectedOption} onChange={setSelectedOption} />
            <p>Selected: {selectedOption}</p>

            <h2>Toast</h2>
            <Button label="Show Toast" onClick={showToast} type="primary" />
            <ToastContainer />

            <h2>Accordion</h2>
            <Accordion items={accordionItems} />


            <h2>Pagination</h2>
            <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />

            <h2>Toggle Button</h2>
            <div className="toggle-button" onClick={(e) => e.target.classList.toggle('active')}></div>
        </div>
    );
};

export default DemoPage;
