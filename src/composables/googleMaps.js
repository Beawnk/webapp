let mapsPromise = null;

// Loads the Google Maps JS API the first time a component needs it, instead of
// a blocking <script> in index.html that every page paid for
export function useGoogleMaps() {
  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      window.__onGoogleMapsLoaded = () => resolve(window.google.maps);

      const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__onGoogleMapsLoaded`;
      script.async = true;
      script.onerror = () => {
        // Allow a new attempt next time instead of caching the failure
        mapsPromise = null;
        script.remove();
        reject(new Error('Google Maps failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return mapsPromise;
}
