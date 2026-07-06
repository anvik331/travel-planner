let googleMapsPromise;

export function loadGoogleMaps(apiKey, language) {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const callbackName = `initGoogleMaps_${Date.now()}`;
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      libraries: "places",
      language,
      callback: callbackName
    });

    window[callbackName] = () => {
      delete window[callbackName];
      resolve(window.google);
    };

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      delete window[callbackName];
      googleMapsPromise = undefined;
      reject(new Error("Google Maps failed to load"));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
