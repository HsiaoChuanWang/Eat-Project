import { GoogleMap } from "@react-google-maps/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSearchStore from "../../stores/searchStore.js";
import "./_map.css";

function MyGoogleMaps({ currentPosition, mapRef, map, setMap, onLoad }) {
  const searchArray = useSearchStore((state) => state.searchArray);
  const [redPin, setRedPin] = useState([]);

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
    onLoad(map);
  }, []);

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: true,
      mapTypeControl: false,
    }),
    [],
  );

  useEffect(() => {
    if (redPin.length > 0) {
      redPin.forEach((pin) => {
        pin.setMap(null);
      });
      setRedPin([]);
    }

    const infoWindow = new window.google.maps.InfoWindow();
    searchArray.map((markInfo, index) => {
      const lat = markInfo.lat;
      const lng = markInfo.lng;
      const marker = new window.google.maps.Marker({
        title: markInfo.name,
        label: `${index + 1}`,
        map,
        position: { lat, lng },
      });
      setRedPin((pre) => [...pre, marker]);

      marker.addListener("mouseover", () => {
        infoWindow.close(map);

        infoWindow.setContent(`
            <div className="modal" style="width: 250px">
              <div className="modal-body" >
                <h3 className="modal-title"  style="font-size: 16px; font-weight: 700; margin-top: 8px; margin-bottom: 8px">${markInfo.name}</h3>
                <p className="total" style="margin-top: 8px; margin-bottom: 8px">${markInfo.city}${markInfo.district}${markInfo.address}</p>
                <p className="remain" style="margin-top: 10px; margin-bottom: 8px">${markInfo.phone}</p>
                
              </div>
            </div>
          `);

        infoWindow.open(map, marker);
      });

      marker.addListener("mouseout", () => {
        infoWindow.close(map);
      });
    });
  }, [searchArray, map]);

  return (
    <GoogleMap
      zoom={14}
      center={currentPosition}
      mapContainerClassName="map-container"
      options={options}
      onLoad={handleMapLoad}
    ></GoogleMap>
  );
}

export default MyGoogleMaps;
