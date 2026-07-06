import { useEffect, useState } from "react";

const blankSpot = {
  name: "",
  area: "",
  category: "Food",
  visitTime: 60,
  priority: "Medium",
  notes: ""
};

const categories = ["Food", "Landmark", "Nature", "Shopping", "Museum", "Other"];
const priorities = ["High", "Medium", "Low"];

function categoryFromPlaceTypes(types = []) {
  if (types.some((type) => ["restaurant", "cafe", "bakery", "meal_takeaway"].includes(type))) {
    return "Food";
  }

  if (types.some((type) => ["museum", "art_gallery"].includes(type))) {
    return "Museum";
  }

  if (types.some((type) => ["park", "natural_feature"].includes(type))) {
    return "Nature";
  }

  if (types.some((type) => ["shopping_mall", "store"].includes(type))) {
    return "Shopping";
  }

  if (types.some((type) => ["tourist_attraction", "point_of_interest"].includes(type))) {
    return "Landmark";
  }

  return "Other";
}

export default function SpotForm({ onAddSpot, selectedPlace, setSelectedPlace, t }) {
  const [spot, setSpot] = useState(blankSpot);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedPlace) {
      return;
    }

    setSpot((currentSpot) => ({
      ...currentSpot,
      name: selectedPlace.name || currentSpot.name,
      area: selectedPlace.area || currentSpot.area,
      category: categoryFromPlaceTypes(selectedPlace.types),
      notes: selectedPlace.address || currentSpot.notes
    }));
  }, [selectedPlace]);

  function updateField(field, value) {
    setSpot((currentSpot) => ({
      ...currentSpot,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!spot.name.trim()) {
      setError(t.nameError);
      return;
    }

    onAddSpot({
      ...spot,
      id: crypto.randomUUID(),
      name: spot.name.trim(),
      area: spot.area.trim() || t.unknownArea,
      address: selectedPlace?.address || "",
      rating: selectedPlace?.rating || null,
      placeId: selectedPlace?.placeId || "",
      lat: selectedPlace?.lat || null,
      lng: selectedPlace?.lng || null,
      mapUrl: selectedPlace?.mapUrl || "",
      visitTime: Number(spot.visitTime),
      notes: spot.notes.trim()
    });

    setSpot(blankSpot);
    setSelectedPlace(null);
    setError("");
  }

  return (
    <form className="panel spot-form" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t.addStop}</p>
          <h2>{t.newTripSpot}</h2>
        </div>
        <button className="primary-button" type="submit">
          {t.addSpot}
        </button>
      </div>

      <label>
        {t.placeName}
        <input
          value={spot.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder={t.placePlaceholder}
        />
      </label>

      <div className="form-grid">
        <label>
          {t.area}
          <input
            value={spot.area}
            onChange={(event) => updateField("area", event.target.value)}
            placeholder={t.areaPlaceholder}
          />
        </label>

        <label>
          {t.category}
          <select
            value={spot.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {t.categories[category]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-grid">
        <label>
          {t.visitTime}
          <input
            min="15"
            step="15"
            type="number"
            value={spot.visitTime}
            onChange={(event) => updateField("visitTime", event.target.value)}
          />
        </label>

        <label>
          {t.priority}
          <select
            value={spot.priority}
            onChange={(event) => updateField("priority", event.target.value)}
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {t.priorities[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        {t.notes}
        <textarea
          value={spot.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder={t.notesPlaceholder}
          rows="4"
        />
      </label>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
