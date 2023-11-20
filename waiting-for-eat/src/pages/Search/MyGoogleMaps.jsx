import { GoogleMap } from "@react-google-maps/api";
import React, { useCallback, useEffect, useMemo } from "react";
import "./_map.css";

function MyGoogleMaps({ currentPosition, mapRef, map, setMap, onLoad, marks }) {
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
    []
  );

  //六、使用紅色Mark，標記出位置所有符合的位置
  useEffect(() => {
    // console.log(marks);
    marks.map((markInfo) => {
      const lat = markInfo.lat;
      const lng = markInfo.lng;
      const marker = new window.google.maps.Marker({
        map,
        position: { lat, lng },
      });

      const infoWindow = new window.google.maps.InfoWindow();
      //   console.log(marker);

      marker.addListener("click", () => {
        infoWindow.setContent(`
            <div className="modal">
              <div className="modal-body">
                <h5 className="modal-title">${markInfo.name}</h5>
                <p className="total">${markInfo.formatted_address}</p>
                <p className="remain">${markInfo.price_level}</p>
                <p>${markInfo.rating}</p>
              </div>
            </div>
          `);
        infoWindow.open(map, marker);
      });
    });
  }, [marks]);

  //二、使用<GoogleMap></GoogleMap>來載入地圖
  return (
    <GoogleMap
      zoom={18}
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
