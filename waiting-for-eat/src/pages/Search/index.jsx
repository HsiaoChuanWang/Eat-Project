import { useLoadScript } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import MyGoogleMaps from "./MyGoogleMaps";

const libraries = ["places"]; //

const Search = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  // 台北市的經緯度:預設位置, 使用useMemo hook (dependencies [])只會渲染一次
  const defaultCenter = useMemo(
    () => ({
      lat: 25.033671,
      lng: 121.564427,
    }),
    []
  );

  const mapRef = useRef();
  // 地圖加載後進行初始化操作
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // map 狀態 及 顯示資料
  // map 是 google maps 的物件 設置state的變化去追蹤他的變化
  const [map, setMap] = useState(null);

  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  const [marks, setmarks] = useState([]);

  const inputRef = useRef(null);
  function handleClick() {
    const PlacesService = new window.google.maps.places.PlacesService(map);
    const searchCenter = new window.google.maps.LatLng(
      currentPosition.lat,
      currentPosition.lng
    );

    const PlaceSearchRequest = {
      keyword: inputRef.current.value,
      location: searchCenter,
      radius: "500",
      type: "restaurant",
    }; //中心發散500公尺

    PlacesService.nearbySearch(PlaceSearchRequest, (results, status) => {
      if (status === "OK") {
        setmarks(results);
      } else {
        console.log("error");
        console.log(`Geocode + ${status}`);
      }
    });

    console.log(marks);
  }

  //提醒使用者正在載入
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      <div>
        <MyGoogleMaps
          currentPosition={currentPosition}
          mapRef={mapRef}
          onLoad={onLoad}
          map={map}
          setMap={setMap}
          marks={marks}
        />
      </div>

      <div>
        <input ref={inputRef}></input>
        <button onClick={handleClick}>按我</button>
      </div>
    </div>
  );
};

export default Search;
