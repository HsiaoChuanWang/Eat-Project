import { useLoadScript } from "@react-google-maps/api";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useMemo, useRef, useState } from "react";
import db from "../../firebase";
import MyGoogleMaps from "./MyGoogleMaps";

const libraries = ["places"];

function Search() {
  //一、將Google Map顯示於畫面
  //isLoaded為布林值，地圖準備好即進行渲染
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  // 三、地圖加載後進行初始化操作
  const mapRef = useRef();
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  //四、設定初使地圖畫面之經緯度，使用useMemo(dependencies[])控制只渲染一次
  const defaultCenter = useMemo(
    () => ({
      lat: 25.033671,
      lng: 121.564427,
    }),
    [],
  );

  //五、設定取得input後的值，該如何變化
  // map是google map的物件，設置state的變化去追蹤它的變化
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [restaurant, setRestaurant] = useState({});
  const [searchLat, setSearchLat] = useState(0);
  const [searchLng, setSearchLng] = useState(0);
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [marks, setMarks] = useState([]);

  const companyRef = collection(db, "company");

  //搜尋特定一間店的店名
  async function getRestaurant(searchitem) {
    const q = query(companyRef, where("name", "==", searchitem));
    const querySnapshot = await getDocs(q);

    let dataList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataList.push(data);

      setCurrentPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });
    setMarks(dataList);
  }

  function handleRestaurant() {
    getRestaurant(searchName);
  }

  //搜尋地點
  async function getPlace(searchitem) {
    const q = query(companyRef, where("city", "==", searchitem));
    const querySnapshot = await getDocs(q);

    let dataList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataList.push(data);

      setCurrentPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });
    setMarks(dataList);
  }

  function handlePlace() {
    getPlace(searchPlace);
  }

  //二、提醒使用者正在載入，使用<GoogleMap></GoogleMap>來載入地圖
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
        <input
          value={searchName}
          placeholder="搜尋餐廳"
          onChange={(e) => setSearchName(e.target.value)}
        ></input>
        <button onClick={handleRestaurant}>按我</button>

        <input
          value={searchPlace}
          placeholder="搜尋地點"
          onChange={(e) => setSearchPlace(e.target.value)}
        ></input>
        <button onClick={handlePlace}>按我</button>
      </div>

      {marks.map((mark, index) => {
        return (
          <div key={mark.name}>
            <h2>
              {index + 1}.{mark.name}
            </h2>
            <h4>{mark.phone}</h4>
            <h4>{mark.address}</h4>
          </div>
        );
      })}
    </div>
  );
}

export default Search;
