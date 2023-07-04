import {useEffect, useState} from 'react';

const scriptId = 'google-map'

const useGoogleMap = () => {
  const [isReady, setIsReady] = useState(false);

  const hasGoogleMapScript = document.getElementById(scriptId) != null;

  useEffect(() => {
    const checkGoogleScript = () => {
      setTimeout(() => {
        if (!window.googleMapReady) checkGoogleScript();

        setIsReady(true);
      }, 500);
    };

    if (hasGoogleMapScript) checkGoogleScript();
  }, []);

  if (!hasGoogleMapScript) {
    const scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.async = true;
    scriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&callback=initMap&libraries=places&v=weekly`;
    window.initMap = async () => {
      window.googleMapReady = true;
      setIsReady(true);
    }
    document.head.appendChild(scriptEl);
  }

  const createNewMap = (containerDom, options) => {
    return new window.google.maps.Map(containerDom, {
      zoom: 15,
      center: {lat: 33.450701, lng: 126.570667},
      ...options,
    });
  };

  const placeSearchInput = (dom, map) => {
    const searchBox = new window.google.maps.places.SearchBox(dom);
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(dom);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    let markers = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (!places.length) return;

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const icon = {
          url: place.icon,
          size: new window.google.maps.Size(71, 71),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(17, 34),
          scaledSize: new window.google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(
          new window.google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  return {ready: isReady, createNewMap, placeSearchInput};
};

export default useGoogleMap;
