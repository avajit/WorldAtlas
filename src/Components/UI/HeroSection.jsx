import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <main className="hero-section main">
      <div className="container grid grid-two-cols">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="heading-xl">
              Explore the world, One Country at a Time.
            </h1>
            <p className="paragraph">
              Discover the history, culture, and beauty of every nation. Sort,
              search, and filter through countries to find the details you want.
            </p>

            {/* ✅ Button now navigates to About page */}
            <button
              className="btn btn-darken btn-inline"
              onClick={() => navigate("/about")}
            >
              Start Exploring
            </button>
          </div>

          <div className="hero-image">
            <img
              src="/images/pngwing.com.png"
              alt="world beauty"
              className="banner-image"
            />
          </div>
        </div>
      </div>
    </main>
  );
};
