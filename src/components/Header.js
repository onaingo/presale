import React from 'react';
import '../styles/header.css';;

const Header = ({ title }) => {
    return (
        <header className="custom-header">
            <h1>{title}</h1>
        </header>
    );
};

export default Header;
