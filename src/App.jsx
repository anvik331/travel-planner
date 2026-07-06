import { useMemo, useState } from "react";
import MapPicker from "./components/MapPicker.jsx";
import PlanSummary from "./components/PlanSummary.jsx";
import SpotForm from "./components/SpotForm.jsx";
import SpotList from "./components/SpotList.jsx";
import { sampleSpots } from "./data/sampleSpots.js";
import { languages, translations } from "./i18n.js";

export default function App() {
  const [spots, setSpots] = useState(sampleSpots);
  const [searchText, setSearchText] = useState("");
  const [language, setLanguage] = useState("en");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const t = translations[language];

  const filteredSpots = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return spots;
    }

    return spots.filter((spot) => {
      return [
        spot.name,
        spot.area,
        spot.address,
        spot.category,
        spot.priority,
        spot.notes
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [searchText, spots]);

  function addSpot(newSpot) {
    setSpots((currentSpots) => [newSpot, ...currentSpots]);
  }

  function deleteSpot(spotId) {
    setSpots((currentSpots) => currentSpots.filter((spot) => spot.id !== spotId));
  }

  function resetSampleData() {
    setSpots(sampleSpots);
    setSearchText("");
    setSelectedPlace(null);
  }

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">{t.appEyebrow}</p>
          <h1>{t.appTitle}</h1>
          <p className="intro">{t.appIntro}</p>
        </div>

        <div className="header-actions">
          <input
            aria-label={t.searchSpots}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={t.searchSpots}
          />
          <label className="language-select">
            <span>{t.languageLabel}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <button className="secondary-button" type="button" onClick={resetSampleData}>
            {t.reset}
          </button>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="form-stack">
          <MapPicker
            language={language}
            onSelectPlace={setSelectedPlace}
            selectedPlace={selectedPlace}
            spots={spots}
            t={t}
          />
          <SpotForm
            onAddSpot={addSpot}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            t={t}
          />
        </div>
        <PlanSummary language={language} spots={spots} t={t} />
      </section>

      <SpotList spots={filteredSpots} onDeleteSpot={deleteSpot} t={t} />
    </main>
  );
}
