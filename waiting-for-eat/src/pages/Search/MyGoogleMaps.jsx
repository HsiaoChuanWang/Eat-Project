import { GoogleMap } from "@react-google-maps/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSearchStore from "../../stores/searchStore";
import "./_map.css";

function MyGoogleMaps({ currentPosition, mapRef, map, setMap, onLoad }) {
  const searchArray = useSearchStore((state) => state.searchArray);
  const [redPin, setRedPin] = useState([]);
  //三、地圖加載時進行初始化
  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
    onLoad(map);
  }, []);

  // 五、隱藏google map上不必要的按鈕
  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: true,
      mapTypeControl: false,
    }),
    [],
  );

  //六、使用紅色Mark，標記出位置所有符合的位置
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
        // animation: google.maps.Animation.DROP,
      });
      setRedPin((pre) => [...pre, marker]);

      marker.addListener("mouseover", () => {
        infoWindow.close(map);
        // toggleBounce();
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

        // function toggleBounce() {
        //   if (marker.getAnimation() !== null) {
        //     marker.setAnimation(null);
        //   } else {
        //     marker.setAnimation(google.maps.Animation.BOUNCE);
        //   }
        // }
      });

      marker.addListener("mouseout", () => {
        infoWindow.close(map);
      });
    });
  }, [searchArray, map]);

  //二、使用<GoogleMap></GoogleMap>來載入地圖
  return (
    <GoogleMap
      zoom={14}
      center={currentPosition}
      mapContainerClassName="map-container"
      options={options}
      onLoad={handleMapLoad}
    >
      {/* <MarkerF position={currentPosition} /> */}
    </GoogleMap>
  );
}

export default MyGoogleMaps;
