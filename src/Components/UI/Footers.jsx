import React from "react";
import { NavLink } from "react-router-dom";
import footerContact from "../../api/footerApi.json";
import "../../App.css";

const Footers = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container grid grid-three-cols">
        {footerContact.map((curData, index) => {
          const { icon, title, details, path } = curData;
          return (
            <NavLink
              to={path}
              key={index}
              className="footer-contact"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="icon">{icon}</div>
              <div className="footer-contact-text">
                <p className="footer-title">{title}</p>
                <p className="footer-details">{details}</p>
              </div>
            </NavLink>
          );
        })}
      </div>

      <hr className="footer-line" />

      <p className="footer-copy">
        © {new Date().getFullYear()} Avajit. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footers;
