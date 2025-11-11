import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const CountryDetails = () => {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then((res) => res.json())
      .then((data) => {
        setCountry(data[0]);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching country details:", err));
  }, [name]);

  if (loading) return <p>Loading details...</p>;
  if (!country) return <p>Country not found!</p>;

  return (
    <section className="country-details">
      <Link to="/country" className="back-btn">← Back</Link>

      <div className="details-container">
        <img src={country.flags?.png} alt={country.name?.common} className="details-flag" />

        <div className="details-info">
          <h2>{country.name?.common}</h2>
          <p><strong>Official Name:</strong> {country.name?.official}</p>
          <p><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</p>
          <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Subregion:</strong> {country.subregion}</p>
          <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
          <p><strong>Currencies:</strong> {country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A"}</p>
          <p><strong>Timezones:</strong> {country.timezones?.join(", ")}</p>
          <p><strong>Area:</strong> {country.area?.toLocaleString()} km²</p>
          <p><strong>Continents:</strong> {country.continents?.join(", ")}</p>
          <p><strong>Start of Week:</strong> {country.startOfWeek}</p>
          <p><strong>Maps:</strong> <a href={country.maps?.googleMaps} target="_blank" rel="noreferrer">View on Google Maps</a></p>
        </div>
      </div>
    </section>
  );
};
