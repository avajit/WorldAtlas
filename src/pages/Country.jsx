import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Country = () => {
  const [countries, setCountries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const handleSeeMore = () => setVisibleCount((prev) => prev + 12);
  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm)
  );

  if (loading) return <p>Loading countries...</p>;

  return (
    <section className="about-section">
      <div className="about-header">
        <h2>Explore the World</h2>
        <input
          type="text"
          placeholder="Search country..."
          value={searchTerm}
          onChange={handleSearch}
          className="country-search"
        />
      </div>

      <div className="countries-grid">
        {filteredCountries.slice(0, visibleCount).map((country, index) => (
          <Link
            to={`/country/${encodeURIComponent(country.name.common)}`} // ✅ dynamic route
            key={index}
            className="country-card"
          >
            <img src={country.flags?.png} alt={country.name?.common} className="country-flag" />
            <h3>{country.name?.common}</h3>
            <p>Capital: {country.capital ? country.capital[0] : "N/A"}</p>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>Region: {country.region}</p>
          </Link>
        ))}
      </div>

      {visibleCount < filteredCountries.length && (
        <div className="see-more-container">
          <button onClick={handleSeeMore} className="see-more-btn">See More</button>
        </div>
      )}

      {filteredCountries.length === 0 && !loading && <p>No countries found for "{searchTerm}"</p>}
    </section>
  );
};
