import { GoogleMap, MarkerF } from "@react-google-maps/api";
import React, { useCallback, useEffect, useMemo } from "react";
import "./_map.css";

export default function GoogleMaps({
  currentPosition,
  mapRef,
  map,
  setMap,
  onLoad,
  marks,
}) {
  // const [currentInfoWindow, setCurrentInfoWindow] = useState(null)
  // <GoogleMap> 條件設定，隱藏不必要的按鈕
  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: true,
      mapTypeControl: false,
    }),
    []
  );

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
    // map.setZomm(18)
    // map.setCenter(coords)
    onLoad(map);
  }, []);

  useEffect(() => {
    console.log(marks);
    marks.map((markInfo) => {
      const lat = markInfo.geometry.location.lat();
      const lng = markInfo.geometry.location.lng();
      const marker = new window.google.maps.Marker({
        key: markInfo.place_id,
        map,
        position: { lat, lng },
      });

      const infoWindow = new window.google.maps.InfoWindow();
      console.log(marker);

      //取得詳細資訊
      // const PlacesService = new window.google.maps.places.PlacesService(map);
      // PlacesService.getDetails({placeId : markInfo.place_id},(results, status)=>{
      //   if (status === 'OK') {
      //     console.log(results)
      //   } else {
      //     console.log('error')
      //     console.log(`Geocode + ${status}`)
      //   }
      // })

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
        // setCurrentInfoWindow(infoWindow)
      });
    });
  }, [marks]);

  // useEffect(() => {
  //   if (map) {
  //     const clickListener = map.addListener('click', () => {
  //       if (currentInfoWindow) {
  //         currentInfoWindow.close()
  //         setCurrentInfoWindow(null)
  //       }
  //     })
  //     return () => {
  //       window.google.maps.event.removeListener(clickListener)
  //     }
  //   }
  // }, [map])

  return (
    <GoogleMap
      zoom={18}
      center={currentPosition}
      mapContainerClassName="map-container"
      options={options}
      onLoad={handleMapLoad}
    >
      <MarkerF position={currentPosition} />
    </GoogleMap>
  );
}
