import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import "../App.css"; 

const Navbar = () => {
    const [name, setName] = useState("");

    const handleNameChange = () => {
        const newName = window.prompt("What's your name?");
        if (newName) {
            setName(newName);
            localStorage.setItem('userName', newName);
        }
    };

    useEffect(() => {
        // Check if name is already stored
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setName(storedName);
        } else {
            // Prompt for name if not stored
            const userName = window.prompt("What's your name?");
            if (userName) {
                setName(userName);
                localStorage.setItem('userName', userName);
            }
        }
    }, []); // Empty dependency array means this runs once on mount

    return (
        <nav className="navbar">
            <h2 className="header">Eventonica</h2>
            <h3 className="greeting" onClick={handleNameChange} style={{ cursor: 'pointer' }}>
                Hello, {name}!
            </h3>
            <ul className="navbar-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">Manage Events</Link></li>
                <li><Link to="/calendar">Calendar View</Link></li>
            </ul>
        </nav>
    );
};  

export default Navbar;