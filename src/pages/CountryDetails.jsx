import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const CountryDetails = () => {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_RC_API_KEY;
  // /rc-api is proxied by Vite → https://api.restcountries.com (no CORS)

  useEffect(() => {
    fetch(`/rc-api/countries/v5?q=${encodeURIComponent(name)}&limit=1`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
      .then((res) => res.json())
      .then((json) => {
        setCountry(json.data?.objects?.[0] || null);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching country details:", err));
  }, [name]);

  if (loading)
    return (
      <div className="cd-loading">
        <div className="cd-spinner"></div>
        <p>Loading country data…</p>
      </div>
    );
  if (!country)
    return (
      <div className="cd-loading">
        <p>Country not found!</p>
        <Link to="/country" className="back-btn" style={{ marginTop: "1rem" }}>← Back</Link>
      </div>
    );

  /* ── helpers ── */
  const memberships = country.memberships || {};
  const activeMemberships = Object.entries(memberships)
    .filter(([, val]) => val)
    .map(([key]) => key.toUpperCase().replace(/_/g, " "));

  const latestGini = (() => {
    const g = country.economy?.gini_coefficient;
    if (!g) return null;
    const years = Object.keys(g).sort((a, b) => b - a);
    return years.length ? { year: years[0], value: g[years[0]] } : null;
  })();

  const flagDominant = country.flag?.colors?.dominant || "#1a1a1a";
  const flagProminent = country.flag?.colors?.prominent || "#ffcc00";

  return (
    <section className="cd-page">
      {/* ── HERO BANNER ── */}
      <div
        className="cd-hero"
        style={{ background: `linear-gradient(135deg, ${flagDominant}33, #0d0d0d 60%)` }}
      >
        <div className="cd-hero-inner">
          <Link to="/country" className="back-btn">← Back</Link>

          <div className="cd-hero-content">
            <div className="cd-hero-left">
              <div className="cd-flag-emoji">{country.flag?.emoji}</div>
              <h1 className="cd-country-name" style={{ color: flagProminent }}>
                {country.names?.common}
              </h1>
              <p className="cd-official-name">{country.names?.official}</p>
              <div className="cd-badges">
                {country.classification?.sovereign && <span className="cd-badge cd-badge-green">🏳 Sovereign</span>}
                {country.classification?.un_member && <span className="cd-badge cd-badge-blue">🌐 UN Member</span>}
                {country.landlocked && <span className="cd-badge cd-badge-amber">🏔 Landlocked</span>}
                {country.classification?.disputed && <span className="cd-badge cd-badge-red">⚠ Disputed</span>}
              </div>
            </div>
            <div className="cd-hero-right">
              <img
                src={country.flag?.url_png}
                alt={`Flag of ${country.names?.common}`}
                className="cd-flag-img"
              />
              {/* Flag color palette */}
              <div className="cd-flag-palette">
                {country.flag?.colors?.palette?.slice(0, 6).map((c, i) => (
                  <div
                    key={i}
                    className="cd-swatch"
                    style={{ background: c.hex }}
                    title={`${c.hex} (${(c.proportion * 100).toFixed(1)}%)`}
                  />
                ))}
              </div>
              <p className="cd-flag-desc">{country.flag?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID SECTIONS ── */}
      <div className="cd-grid">

        {/* 📍 Geography */}
        <div className="cd-card">
          <h3 className="cd-card-title">📍 Geography</h3>
          <div className="cd-rows">
            <InfoRow label="Capital" value={
              Array.isArray(country.capitals)
                ? country.capitals.map(c => c.name).join(", ") || "N/A"
                : country.capitals?.name || "N/A"
            } />
            <InfoRow label="Capital Coords" value={(() => {
              const cap = Array.isArray(country.capitals) ? country.capitals[0] : country.capitals;
              return cap?.coordinates
                ? `${cap.coordinates.lat}°, ${cap.coordinates.lng}°`
                : "N/A";
            })()} />
            <InfoRow label="Region" value={country.region} />
            <InfoRow label="Subregion" value={country.subregion} />
            <InfoRow label="Continent" value={
              Array.isArray(country.continents)
                ? country.continents.join(", ")
                : country.continents
            } />
            <InfoRow label="Area" value={
              country.area?.kilometers
                ? `${country.area.kilometers.toLocaleString()} km² / ${country.area.miles?.toLocaleString()} mi²`
                : "N/A"
            } />
            <InfoRow label="Coordinates" value={
              country.coordinates
                ? `${country.coordinates.lat}°N, ${country.coordinates.lng}°E`
                : "N/A"
            } />
            <InfoRow label="Landlocked" value={country.landlocked ? "Yes" : "No"} />
            <InfoRow label="Bordering Countries" value={
              Array.isArray(country.borders)
                ? country.borders.join(", ") || "None"
                : country.borders || "None"
            } />
            <InfoRow label="Timezones" value={country.timezones?.join(", ")} />
          </div>
        </div>

        {/* 👥 People & Society */}
        <div className="cd-card">
          <h3 className="cd-card-title">👥 People & Society</h3>
          <div className="cd-rows">
            <InfoRow label="Population" value={country.population?.toLocaleString()} />
            <InfoRow label="Languages" value={country.languages?.map(l => l.name).join(", ") || "N/A"} />
            <InfoRow label="Native Language Names" value={country.languages?.map(l => l.native_name).join(", ") || "N/A"} />
            <InfoRow label="Demonym (Male)" value={country.demonyms?.eng?.m || "N/A"} />
            <InfoRow label="Demonym (Female)" value={country.demonyms?.eng?.f || "N/A"} />
            <InfoRow label="Start of Week" value={country.date?.start_of_week} />
            <InfoRow label="Academic Year Start" value={
              country.date?.academic_year_start
                ? `Month ${country.date.academic_year_start.month}`
                : "N/A"
            } />
          </div>
        </div>

        {/* 🏛 Government */}
        <div className="cd-card">
          <h3 className="cd-card-title">🏛 Government</h3>
          <div className="cd-rows">
            <InfoRow label="Government Type" value={country.government_type || "N/A"} />
            <InfoRow label="ISO Status" value={country.classification?.iso_status || "N/A"} />
            <InfoRow label="Sovereign State" value={country.classification?.sovereign ? "Yes" : "No"} />
            <InfoRow label="UN Member" value={country.classification?.un_member ? "Yes" : "No"} />
            <InfoRow label="UN Observer" value={country.classification?.un_observer ? "Yes" : "No"} />
            <InfoRow label="Dependency" value={country.classification?.dependency ? "Yes" : "No"} />
            <InfoRow label="Disputed Territory" value={country.classification?.disputed ? "Yes" : "No"} />
          </div>
        </div>

        {/* 💰 Economy & Currency */}
        <div className="cd-card">
          <h3 className="cd-card-title">💰 Economy & Currency</h3>
          <div className="cd-rows">
            <InfoRow label="Currencies" value={
              country.currencies?.map(c => `${c.name} (${c.symbol}) — ${c.code}`).join(", ") || "N/A"
            } />
            <InfoRow label="Decimal Separator" value={country.number_format?.decimal_separator} />
            <InfoRow label="Thousands Separator" value={country.number_format?.thousands_separator} />
            {latestGini && (
              <InfoRow label={`Gini Index (${latestGini.year})`} value={`${latestGini.value}`} />
            )}
            {country.economy?.gini_coefficient && (
              <div className="cd-gini-chart">
                {Object.entries(country.economy.gini_coefficient)
                  .sort((a, b) => a[0] - b[0])
                  .map(([year, val]) => (
                    <div key={year} className="cd-gini-bar-wrap" title={`${year}: ${val}`}>
                      <div className="cd-gini-bar" style={{ height: `${Math.min(val * 1.5, 80)}px` }} />
                      <span className="cd-gini-year">{year}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* 📞 Identity & Codes */}
        <div className="cd-card">
          <h3 className="cd-card-title">📞 Identity & Codes</h3>
          <div className="cd-rows">
            <InfoRow label="Phone Code" value={`+${country.calling_codes}`} />
            <InfoRow label="TLD" value={
              Array.isArray(country.tlds)
                ? country.tlds.join(", ")
                : country.tlds
            } />
            <InfoRow label="ISO Alpha-2" value={country.codes?.alpha_2} />
            <InfoRow label="ISO Alpha-3" value={country.codes?.alpha_3} />
            <InfoRow label="FIFA Code" value={country.codes?.fifa || "N/A"} />
            <InfoRow label="FIPS Code" value={country.codes?.fips || "N/A"} />
            <InfoRow label="Flag Unicode" value={country.flag?.unicode} />
            <InfoRow label="Flag HTML Entity" value={country.flag?.html_entity} />
          </div>
        </div>

        {/* 🚗 Transport & Practical */}
        <div className="cd-card">
          <h3 className="cd-card-title">🚗 Transport & Practical</h3>
          <div className="cd-rows">
            <InfoRow label="Driving Side" value={
              <span className={`cd-drive-badge cd-drive-${country.cars?.driving_side}`}>
                {country.cars?.driving_side === "right" ? "🚗➡ Right-hand" : "⬅🚗 Left-hand"}
              </span>
            } />
            <InfoRow label="Car Plate Sign" value={
              Array.isArray(country.cars?.signs)
                ? country.cars.signs.join(", ")
                : country.cars?.signs || "N/A"
            } />
            <InfoRow label="Measurement" value={country.units?.measurement_system} />
            <InfoRow label="Temperature" value={country.units?.temperature_scale} />
            <InfoRow label="Postal Code Format" value={country.postal_code?.format || "N/A"} />
            <InfoRow label="Fiscal Year (Govt)" value={
              country.date?.fiscal_year_start?.government
                ? `Month ${country.date.fiscal_year_start.government.month}`
                : "N/A"
            } />
          </div>
        </div>

        {/* 🤝 International Memberships */}
        {activeMemberships.length > 0 && (
          <div className="cd-card cd-card-wide">
            <h3 className="cd-card-title">🤝 International Memberships</h3>
            <div className="cd-membership-grid">
              {activeMemberships.map((m) => (
                <span key={m} className="cd-membership-badge">{m}</span>
              ))}
            </div>
          </div>
        )}

        {/* 🔗 Links */}
        <div className="cd-card">
          <h3 className="cd-card-title">🔗 Useful Links</h3>
          <div className="cd-links">
            {country.links?.official && (
              <a href={country.links.official} target="_blank" rel="noreferrer" className="cd-link-btn">
                🌐 Official Website
              </a>
            )}
            {country.links?.wikipedia && (
              <a href={country.links.wikipedia} target="_blank" rel="noreferrer" className="cd-link-btn">
                📖 Wikipedia
              </a>
            )}
            {country.links?.google_maps && (
              <a href={country.links.google_maps} target="_blank" rel="noreferrer" className="cd-link-btn">
                🗺 Google Maps
              </a>
            )}
            {country.links?.open_street_maps && (
              <a href={country.links.open_street_maps} target="_blank" rel="noreferrer" className="cd-link-btn">
                🗺 OpenStreetMap
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

/* ── Helper component ── */
const InfoRow = ({ label, value }) => (
  <div className="cd-info-row">
    <span className="cd-info-label">{label}</span>
    <span className="cd-info-value">{value ?? "N/A"}</span>
  </div>
);
