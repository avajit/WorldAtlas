import { NavLink } from "react-router-dom";
import { useState } from "react";

export const Headers = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className="container">
        <div className="grid navbar-grid">
          <div className="Logo">
            <NavLink to="/">
              <h1>WorldAtlas</h1>
            </NavLink>
          </div>
          
          {/* Hamburger Icon for Mobile */}
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className={`hamburger-line ${isMenuOpen ? 'line1' : ''}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'line2' : ''}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'line3' : ''}`}></div>
          </div>

          <nav className={isMenuOpen ? "nav-open" : ""}>
            <ul>
              <li>
                <NavLink to="/" onClick={closeMenu}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={closeMenu}>About</NavLink>
              </li>
              <li>
                <NavLink to="/country" onClick={closeMenu}>Country</NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};