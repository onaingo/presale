import React, { useState } from 'react';
import '../styles/slider.css';

const Slider = ({ min, max, value, onChange }) => {
    const [sliderValue, setSliderValue] = useState(value);

    const handleSliderChange = (e) => {
        setSliderValue(e.target.value);
        onChange(e);
    };

    return (
        <input 
            type="range" 
            min={min} 
            max={max} 
            value={sliderValue} 
            className="custom-slider" 
            onChange={handleSliderChange} 
        />
    );
};

export default Slider;
