import React from "react";
import { Link } from "react-router-dom"
const Navbar = () => {
    return (
    <nav className="navbar">
        <h2 className="header">Eventonica</h2>
        <ul className="navbar-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/">Manage Events</Link></li>
        <li><Link to="/">Manage Participants</Link></li>
        </ul>
    </nav>
    );
};  
export default Navbar;