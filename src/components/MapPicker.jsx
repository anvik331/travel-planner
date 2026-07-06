import { useEffect, useRef, useState } from "react";
import L from "leaflet";

const taipeiCenter = [25.033, 121.5654];
const nominatimBaseUrl = "https://nominatim.openstreetmap.org";

function placeFromNominatim(result) {
  const lat = Number(result.lat);
  const lng = Number(result.lon);
  const address = result.address || {};
  const area =
    address.suburb ||
    address.city_district ||
    address.town ||
    address.city ||
    address.county ||
    "";

  return {
    name: result.name || result.display_name?.split(",")[0] || "Selected place",
    area,
    address: result.display_name || "",
    lat,
    lng,
    mapUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`,
    osmId: result.osm_id,
    osmType: result.osm_type,
    types: [result.category, result.type].filter(Boolean)
  };
}

function selectedIcon() {
  return L.divIcon({
    className: "selected-map-marker",
    html: "<span></span>",
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}

export default function MapPicker({ spots, selectedPlace, onSelectPlace, t, language }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const savedLayerRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState("ready");

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapNodeRef.current, {
      center: taipeiCenter,
      zoom: 12,
      scrollWheelZoom: true
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    savedLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    map.on("click", (event) => {
      reverseSelectPlace(event.latlng);
    });

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!savedLayerRef.current) {
      return;
    }

    savedLayerRef.current.clearLayers();

    spots
      .filter((spot) => spot.lat && spot.lng)
      .forEach((spot) => {
        L.circleMarker([spot.lat, spot.lng], {
          radius: 7,
          color: "#ffffff",
          weight: 2,
          fillColor: "#2f7d79",
          fillOpacity: 1
        })
          .bindPopup(`<strong>${spot.name}</strong><br>${spot.area || ""}`)
          .addTo(savedLayerRef.current);
      });
  }, [spots]);

  function showSelectedPlace(place) {
    if (!mapRef.current || !place.lat || !place.lng) {
      return;
    }

    const latLng = [place.lat, place.lng];
    mapRef.current.setView(latLng, 15);

    if (!selectedMarkerRef.current) {
      selectedMarkerRef.current = L.marker(latLng, { icon: selectedIcon() }).addTo(
        mapRef.current
      );
    }

    selectedMarkerRef.current.setLatLng(latLng).bindPopup(place.name).openPopup();
    onSelectPlace(place);
  }

  async function searchPlaces(event) {
    event.preventDefault();

    if (!searchText.trim()) {
      return;
    }

    setStatus("searching");

    try {
      const params = new URLSearchParams({
        q: searchText.trim(),
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
        "accept-language": language === "zh" ? "zh-TW" : "en"
      });
      const response = await fetch(`${nominatimBaseUrl}/search?${params.toString()}`);
      const results = await response.json();

      setSearchResults(results);
      setStatus(results.length ? "ready" : "empty");
    } catch {
      setStatus("error");
    }
  }

  async function reverseSelectPlace(latLng) {
    setStatus("searching");

    try {
      const params = new URLSearchParams({
        lat: String(latLng.lat),
        lon: String(latLng.lng),
        format: "jsonv2",
        addressdetails: "1",
        "accept-language": language === "zh" ? "zh-TW" : "en"
      });
      const response = await fetch(`${nominatimBaseUrl}/reverse?${params.toString()}`);
      const result = await response.json();
      const place = placeFromNominatim({
        ...result,
        lat: latLng.lat,
        lon: latLng.lng
      });

      setSearchResults([]);
      setStatus("ready");
      showSelectedPlace(place);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="panel map-picker">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t.mapEyebrow}</p>
          <h2>{t.mapTitle}</h2>
        </div>
      </div>

      <form className="map-search" onSubmit={searchPlaces}>
        <label>
          {t.mapSearch}
          <input
            placeholder={t.mapSearchPlaceholder}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </label>
        <button className="secondary-button" type="submit">
          {t.mapSearchButton}
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => {
            const place = placeFromNominatim(result);

            return (
              <button
                key={`${result.osm_type}-${result.osm_id}`}
                type="button"
                onClick={() => {
                  setSearchResults([]);
                  setSearchText(place.name);
                  showSelectedPlace(place);
                }}
              >
                <span>{place.name}</span>
                <small>{place.address}</small>
              </button>
            );
          })}
        </div>
      )}

      <div className="map-frame">
        <div className="map-canvas" ref={mapNodeRef} />
      </div>

      <p className="map-help">
        {status === "searching" ? t.mapSearching : t.mapHelp}
        {status === "empty" && ` ${t.mapNoResults}`}
        {status === "error" && ` ${t.mapError}`}
      </p>

      {selectedPlace && (
        <div className="selected-place">
          <p className="eyebrow">{t.selectedPlace}</p>
          <h3>{selectedPlace.name}</h3>
          <dl>
            <div>
              <dt>{t.address}</dt>
              <dd>{selectedPlace.address || selectedPlace.area || "-"}</dd>
            </div>
          </dl>
          <p>{t.selectedHint}</p>
        </div>
      )}
    </section>
  );
}
