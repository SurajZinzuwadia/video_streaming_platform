import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">Video Streaming Software</a>
      </div>
      {/* <ul className="navbar-links">
        <li><a href="#features">Go Live</a></li>
        <li><a href="#login">Login</a></li>
        <li><a href="#signup" className="navbar-signup">Sign Up</a></li>
      </ul> */}
    </nav>
  );
}

export default Navbar;
