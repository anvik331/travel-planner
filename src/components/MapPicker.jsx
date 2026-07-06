import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../utils/googleMaps.js";

const taipeiCenter = { lat: 25.033, lng: 121.5654 };

function placeToSpotData(place, google) {
  const location = place.geometry?.location;
  const address = place.formatted_address || place.vicinity || "";
  const area =
    place.address_components?.find((part) =>
      part.types.some((type) => ["sublocality", "administrative_area_level_3"].includes(type))
    )?.long_name ||
    place.address_components?.find((part) =>
      part.types.includes("administrative_area_level_2")
    )?.long_name ||
    "";

  return {
    name: place.name || address || "Selected place",
    area,
    address,
    rating: place.rating || null,
    placeId: place.place_id || "",
    lat: location ? location.lat() : null,
    lng: location ? location.lng() : null,
    mapUrl:
      place.url ||
      (location
        ? `https://www.google.com/maps/search/?api=1&query=${location.lat()},${location.lng()}`
        : ""),
    types: place.types || [],
    google
  };
}

export default function MapPicker({ apiKey, spots, selectedPlace, onSelectPlace, t, language }) {
  const mapNodeRef = useRef(null);
  const searchNodeRef = useRef(null);
  const mapRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const savedMarkersRef = useRef([]);
  const placesServiceRef = useRef(null);
  const geocoderRef = useRef(null);
  const [status, setStatus] = useState(apiKey ? "loading" : "missing-key");

  useEffect(() => {
    if (!apiKey) {
      setStatus("missing-key");
      return;
    }

    let isMounted = true;

    async function setupMap() {
      try {
        setStatus("loading");
        const google = await loadGoogleMaps(apiKey, language === "zh" ? "zh-TW" : "en");

        if (!isMounted || !mapNodeRef.current || !searchNodeRef.current) {
          return;
        }

        const map = new google.maps.Map(mapNodeRef.current, {
          center: taipeiCenter,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        mapRef.current = map;
        placesServiceRef.current = new google.maps.places.PlacesService(map);
        geocoderRef.current = new google.maps.Geocoder();

        const autocomplete = new google.maps.places.Autocomplete(searchNodeRef.current, {
          fields: [
            "address_components",
            "formatted_address",
            "geometry",
            "name",
            "place_id",
            "rating",
            "types",
            "url"
          ]
        });

        autocomplete.bindTo("bounds", map);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          selectPlace(place, google);
        });

        map.addListener("click", (event) => {
          selectNearestPlace(event.latLng, google);
        });

        setStatus("ready");
      } catch {
        if (isMounted) {
          setStatus("error");
        }
      }
    }

    setupMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey, language]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) {
      return;
    }

    const google = window.google;

    savedMarkersRef.current.forEach((marker) => marker.setMap(null));
    savedMarkersRef.current = spots
      .filter((spot) => spot.lat && spot.lng)
      .map((spot) => {
        return new google.maps.Marker({
          map: mapRef.current,
          position: { lat: spot.lat, lng: spot.lng },
          title: spot.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#2f7d79",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
          }
        });
      });
  }, [spots, status]);

  function selectPlace(place, google) {
    if (!place?.geometry?.location || !mapRef.current) {
      return;
    }

    const nextPlace = placeToSpotData(place, google);
    mapRef.current.panTo(place.geometry.location);
    mapRef.current.setZoom(15);

    if (!selectedMarkerRef.current) {
      selectedMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        title: nextPlace.name
      });
    }

    selectedMarkerRef.current.setPosition(place.geometry.location);
    selectedMarkerRef.current.setTitle(nextPlace.name);
    onSelectPlace(nextPlace);
  }

  function selectNearestPlace(location, google) {
    if (!placesServiceRef.current) {
      return;
    }

    placesServiceRef.current.nearbySearch(
      {
        location,
        rankBy: google.maps.places.RankBy.DISTANCE
      },
      (results, serviceStatus) => {
        if (serviceStatus === google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
          placesServiceRef.current.getDetails(
            {
              placeId: results[0].place_id,
              fields: [
                "address_components",
                "formatted_address",
                "geometry",
                "name",
                "place_id",
                "rating",
                "types",
                "url"
              ]
            },
            (place, detailsStatus) => {
              if (detailsStatus === google.maps.places.PlacesServiceStatus.OK) {
                selectPlace(place, google);
              }
            }
          );
          return;
        }

        geocoderRef.current?.geocode({ location }, (geocodeResults, geocodeStatus) => {
          if (geocodeStatus === "OK" && geocodeResults?.[0]) {
            selectPlace(
              {
                ...geocodeResults[0],
                name: geocodeResults[0].formatted_address,
                geometry: { location }
              },
              google
            );
          }
        });
      }
    );
  }

  return (
    <section className="panel map-picker">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t.mapEyebrow}</p>
          <h2>{t.mapTitle}</h2>
        </div>
      </div>

      <label>
        {t.mapSearch}
        <input
          disabled={!apiKey || status !== "ready"}
          placeholder={t.mapSearchPlaceholder}
          ref={searchNodeRef}
        />
      </label>

      <div className="map-frame">
        <div className="map-canvas" ref={mapNodeRef} />
        {status !== "ready" && (
          <div className="map-overlay">
            <h3>
              {status === "missing-key" && t.mapMissingKey}
              {status === "loading" && t.mapLoading}
              {status === "error" && t.mapError}
            </h3>
            {status === "missing-key" && <p>{t.mapMissingKeyDetail}</p>}
          </div>
        )}
      </div>

      <p className="map-help">{t.mapHelp}</p>

      {selectedPlace && (
        <div className="selected-place">
          <p className="eyebrow">{t.selectedPlace}</p>
          <h3>{selectedPlace.name}</h3>
          <dl>
            <div>
              <dt>{t.rating}</dt>
              <dd>{selectedPlace.rating ? `${selectedPlace.rating} / 5` : t.noRating}</dd>
            </div>
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
