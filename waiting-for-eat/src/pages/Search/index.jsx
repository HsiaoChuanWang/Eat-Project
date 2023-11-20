import { useLoadScript } from "@react-google-maps/api";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useMemo, useRef, useState } from "react";
import db from "../../firebase";
import MyGoogleMaps from "./MyGoogleMaps";
import hotpot from "./hotpot.jpg";

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
    // console.log(map);
  }, []);

  //四、設定初使地圖畫面之經緯度，使用useMemo(dependencies[])控制只渲染一次
  const defaultCenter = useMemo(
    () => ({
      lat: 25.033671,
      lng: 121.564427,
    }),
    []
  );

  //五、設定取得input後的值，該如何變化
  // map是google map的物件，設置state的變化去追蹤它的變化
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState(null);
  const [restaurant, setRestaurant] = useState({});
  const [searchLat, setSearchLat] = useState(0);
  const [searchLng, setSearchLng] = useState(0);
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [marks, setmarks] = useState([]);

  function handleRestaurant() {
    getSingleRestaurant(searchName);
    const PlacesService = new window.google.maps.places.PlacesService(map); //查詢地點
    const searchCenter = new window.google.maps.LatLng(
      currentPosition.lat,
      currentPosition.lng
    ); //查詢座標

    // const PlaceSearchRequest = {
    //   keyword: searchName,
    //   location: searchCenter,
    //   radius: "5000",
    //   type: "restaurant",
    // }; //中心發散500公尺

    // PlacesService.nearbySearch(PlaceSearchRequest, (results, status) => {
    //   if (status === "OK") {
    //     setmarks(results);
    //     console.log(results);
    //   } else {
    //     console.log("error");
    //     console.log(`Geocode + ${status}`);
    //   }
    // }); //搜尋附近

    // console.log(marks);
  }

  const companyRef = collection(db, "company");

  //搜尋特定一間店的店名
  async function getSingleRestaurant(searchitem) {
    const q = query(companyRef, where("name", "==", searchitem));
    const querySnapshot = await getDocs(q);

    let dataList = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const data = doc.data();
      dataList.push(data);

      setCurrentPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });
    setmarks(dataList);
  }

  //照片選擇食物類別
  function handleCategory(e) {
    getCategory(e.target.title);
    console.log(e.target.title);
  }

  async function getCategory(item) {
    const categoryRef = collection(db, "category");
    const q = query(categoryRef, where("type", "==", item));
    const querySnapshot = await getDocs(q);

    let selectedCategory;
    querySnapshot.forEach((doc) => {
      selectedCategory = Number(doc.id);
    });
    console.log(typeof selectedCategory);

    const qq = query(companyRef, where("category", "==", selectedCategory));
    const querySnapshotC = await getDocs(qq);

    let dataList = [];
    querySnapshotC.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const data = doc.data();
      dataList.push(data);

      setCurrentPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });
    setmarks(dataList);
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
          onChange={(e) => setSearchName(e.target.value)}
        ></input>
        <button onClick={handleRestaurant}>按我</button>

        <input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        ></input>
        <button onClick={handleRestaurant}>按我</button>
      </div>

      <img src={hotpot} title="hotpot" onClick={(e) => handleCategory(e)} />
    </div>
  );
}

export default Search;
