import React from "react";
import { Link } from "react-router-dom"
import "../App.css"; 

const Navbar = () => {
    return (
    <nav className="navbar">
        <h2 className="header">Eventonica</h2>
        <h3 className="greeting">Hello, _____  !</h3>
        <ul className="navbar-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Manage Events</Link></li>
            <li><Link to="/participants">Manage Participants</Link></li>
        </ul>
    </nav>
    );
};  

export default Navbar;