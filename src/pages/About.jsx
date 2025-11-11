import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const About = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/country");
  };

  return (
    <section className="about-container">
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>About This Project 🌍</h1>
        <p>
          Explore the world like never before! This site brings together data from{" "}
          <strong>REST Countries API</strong> to let you discover fascinating facts about
          every nation — from population to culture, economy, and geography.
        </p>
      </motion.div>

      <motion.div
        className="about-features"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="feature-card">
          <h3>🌐 Global Reach</h3>
          <p>Get instant details of over 190 countries, powered by live API data.</p>
        </div>

        <div className="feature-card">
          <h3>⚡ Fast & Interactive</h3>
          <p>Built using React, with dynamic routing and smooth animations.</p>
        </div>

        <div className="feature-card">
          <h3>📊 Rich Data</h3>
          <p>
            Dive deep into each nation’s economy, demographics, language, and culture.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="about-stats"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="stat">
          <h2>190+</h2>
          <p>Countries Covered</p>
        </div>
        <div className="stat">
          <h2>100%</h2>
          <p>Responsive Design</p>
        </div>
        <div className="stat">
          <h2>0.5s</h2>
          <p>Average Load Time</p>
        </div>
      </motion.div>

      <motion.div
        className="about-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>
          Built with ❤️ by <span>Avajit Kumar Kewrat</span>
        </p>
        <button className="explore-btn" onClick={handleExplore}>
          Start Exploring
        </button>
      </motion.div>
    </section>
  );
};
