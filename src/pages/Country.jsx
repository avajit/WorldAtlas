import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const Country = () => {
  const [countries, setCountries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const API_KEY = import.meta.env.VITE_RC_API_KEY;
  const BASE = "/rc-api/countries/v5";
  const PAGE_SIZE = 25;
  const abortRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    const opts = {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: controller.signal,
    };

    const fetchCountries = async () => {
      try {
        // ── Page 1: show immediately ──
        const firstRes = await fetch(`${BASE}?limit=${PAGE_SIZE}&offset=0`, opts);
        if (!firstRes.ok) throw new Error(`API error: ${firstRes.status}`);
        const firstJson = await firstRes.json();

        const total = firstJson.data?.meta?.total ?? 0;
        const firstBatch = firstJson.data?.objects ?? [];

        const sorted = [...firstBatch].sort((a, b) =>
          a.names.common.localeCompare(b.names.common)
        );
        setCountries(sorted);
        setTotalCount(total);
        setLoading(false); // ← Show UI instantly with first 25

        // ── Remaining pages: load in background ──
        const remaining = total - firstBatch.length;
        if (remaining > 0) {
          const pageCount = Math.ceil(remaining / PAGE_SIZE);
          const pagePromises = Array.from({ length: pageCount }, (_, i) =>
            fetch(`${BASE}?limit=${PAGE_SIZE}&offset=${(i + 1) * PAGE_SIZE}`, opts)
              .then((r) => {
                if (!r.ok) throw new Error(`Page error: ${r.status}`);
                return r.json();
              })
              .then((j) => j.data?.objects ?? [])
          );
          const batches = await Promise.all(pagePromises);
          const allCountries = [...firstBatch, ...batches.flat()].sort((a, b) =>
            a.names.common.localeCompare(b.names.common)
          );
          if (!controller.signal.aborted) {
            setCountries(allCountries);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching countries:", err);
          setError("Failed to load countries. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchCountries();
    return () => controller.abort();
  }, []);

  const handleSeeMore = () => setVisibleCount((prev) => prev + 12);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setVisibleCount(12);
  };

  /* ── Helper: extract capital name(s) from the capitals array ── */
  const getCapital = (country) => {
    const caps = country.capitals;
    if (!caps) return "N/A";
    if (Array.isArray(caps)) {
      const names = caps.map((c) => c.name).filter(Boolean);
      return names.length > 0 ? names.join(", ") : "N/A";
    }
    return caps.name || "N/A";
  };

  const filteredCountries = countries.filter((country) =>
    country.names.common.toLowerCase().includes(searchTerm)
  );

  if (loading)
    return (
      <div className="cd-loading">
        <div className="cd-spinner"></div>
        <p>Loading countries…</p>
      </div>
    );

  if (error)
    return (
      <div className="cd-loading">
        <p style={{ color: "#f87171" }}>{error}</p>
      </div>
    );

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

      <p className="country-count">
        Showing {Math.min(visibleCount, filteredCountries.length)} of{" "}
        {filteredCountries.length} countries
        {countries.length < totalCount && (
          <span className="country-loading-more"> · loading more…</span>
        )}
      </p>

      <div className="countries-grid">
        {filteredCountries.slice(0, visibleCount).map((country) => {
          const flagSrc = country.flag?.url_png || null;
          const uniqueKey = country.uuid || country.names.common;

          return (
            <Link
              to={`/country/${encodeURIComponent(country.names.common)}`}
              key={uniqueKey}
              className="country-card"
            >
              {flagSrc ? (
                <img
                  src={flagSrc}
                  alt={`Flag of ${country.names?.common}`}
                  className="country-flag"
                />
              ) : (
                <div className="country-flag-placeholder">
                  {country.flag?.emoji || "🏳"}
                </div>
              )}
              <h3>{country.names?.common}</h3>
              <p>Capital: {getCapital(country)}</p>
              <p>Population: {country.population?.toLocaleString()}</p>
              <p>Region: {country.region}</p>
            </Link>
          );
        })}
      </div>

      {visibleCount < filteredCountries.length && (
        <div className="see-more-container">
          <button onClick={handleSeeMore} className="see-more-btn">
            See More ({filteredCountries.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {filteredCountries.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "2rem" }}>
          No countries found for &quot;{searchTerm}&quot;
        </p>
      )}
    </section>
  );
};
