import { useLoadScript } from "@react-google-maps/api";
import { Rate, Select } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import db from "../../firebase";
import useSearchStore from "../../stores/searchStore";
import useUserStore from "../../stores/userStore";
import MyGoogleMaps from "./MyGoogleMaps";
import tasty from "./tasty.jpg";

const libraries = ["places"];

function Search() {
  //   const [redPin, setRedPin] = useState([]);
  const userInfo = useUserStore((state) => state.userInfo);
  const searchArray = useSearchStore((state) => state.searchArray);
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const navigation = useNavigate();

  async function getfavorite(companyId) {
    const favoriteq = query(
      collection(db, "favorite"),
      where("companyId", "==", companyId),
      where("userId", "==", userInfo.userId),
    );

    let resultList = [];
    const querySnapshot = await getDocs(favoriteq);
    querySnapshot.forEach((doc) => {
      const result = doc.data();
      resultList.push(result);
    });

    if (resultList.length > 0) {
      const finalResult = resultList[0];
      const status = finalResult.status;
      return status;
    } else {
      const status = "";
      return status;
    }
  }

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
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  const companyRef = collection(db, "company");

  //搜尋特定一間店的店名
  async function getRestaurant(searchitem) {
    const q = query(companyRef, where("name", "==", searchitem));
    const querySnapshot = await getDocs(q);

    let dataList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const dataId = doc.id;
      const newData = { ...data, companyId: dataId };

      dataList.push(newData);

      setCurrentPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });

    let resultArray = [];
    dataList.forEach((item) => {
      getfavorite(item.companyId)
        .then((result) => {
          const newData = { ...item, status: result };
          resultArray.push(newData);
          return resultArray;
        })
        .then((resultArray) => {
          setSearchArray([...resultArray]);
        });
    });
  }

  function handleRestaurant() {
    setSearchArray([]);
    getRestaurant(searchName);
  }

  //搜尋地點
  async function getPlace(searchitem) {
    const q = query(companyRef, where("city", "==", searchitem));
    const querySnapshot = await getDocs(q);

    let dataList = [];
    let isCenter = true;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const dataId = doc.id;
      const newData = { ...data, companyId: dataId };

      dataList.push(newData);

      if (isCenter) {
        setCurrentPosition({
          lat: data.lat,
          lng: data.lng,
        });
        isCenter = false;
      }
    });

    let resultArray = [];
    dataList.forEach((item) => {
      getfavorite(item.companyId)
        .then((result) => {
          const newData = { ...item, status: result };
          resultArray.push(newData);
          return resultArray;
        })
        .then((resultArray) => {
          setSearchArray([...resultArray]);
        });
    });
  }

  function handlePlace() {
    setSearchArray([]);
    getPlace(searchPlace);
  }

  //取得所有種類
  function handleCategory(e) {
    setSearchArray([]);
    getCategory(e);
  }

  async function getCategory(item) {
    const qq = query(companyRef, where("category", "==", item));
    const querySnapshotC = await getDocs(qq);

    let dataList = [];
    let isCenter = true;
    querySnapshotC.forEach((doc) => {
      const data = doc.data();
      const dataId = doc.id;
      const newData = { ...data, companyId: dataId, status: status };

      dataList.push(newData);
      if (isCenter) {
        setCurrentPosition({
          lat: data.lat,
          lng: data.lng,
        });
        isCenter = false;
      }
    });

    let resultArray = [];
    dataList.forEach((item) => {
      getfavorite(item.companyId)
        .then((result) => {
          const newData = { ...item, status: result };
          resultArray.push(newData);
          return resultArray;
        })
        .then((resultArray) => {
          setSearchArray([...resultArray]);
        });
    });
  }

  //二、提醒使用者正在載入，使用<GoogleMap></GoogleMap>來載入地圖
  if (!isLoaded) return <div>Loading...</div>;

  const favoriteState = (status) => {
    switch (status) {
      case "like":
        return (
          <>
            <IconContext.Provider value={{ size: "25px" }}>
              <HiThumbUp />
            </IconContext.Provider>
            <p>Like!</p>
          </>
        );

      case "dislike":
        return (
          <>
            <IconContext.Provider
              value={{ size: "25px", backgroundColor: "black" }}
            >
              <HiThumbDown />
            </IconContext.Provider>
            <p>Oh No!</p>
          </>
        );

      case "eaten":
        return (
          <>
            <div className="flex">
              <IconContext.Provider value={{ size: "25px" }}>
                <HiOutlineThumbUp title="noLike" />
              </IconContext.Provider>

              <IconContext.Provider value={{ size: "25px" }}>
                <HiOutlineThumbDown />
              </IconContext.Provider>
            </div>
          </>
        );

      case "":
        return;
    }
  };

  return (
    <div>
      <div>
        <input
          className="border-2 border-solid border-black"
          value={searchName}
          placeholder="搜尋餐廳"
          onChange={(e) => setSearchName(e.target.value)}
        ></input>
        <button
          className="m-2 border-2 border-solid border-black"
          onClick={handleRestaurant}
        >
          按我
        </button>

        <input
          className="border-2 border-solid border-black"
          value={searchPlace}
          placeholder="搜尋地點"
          onChange={(e) => setSearchPlace(e.target.value)}
        ></input>
        <button
          className="m-2 border-2 border-solid border-black"
          onClick={handlePlace}
        >
          按我
        </button>

        <Select
          name="category"
          onChange={(e) => handleCategory(e)}
          showSearch
          style={{
            width: 200,
          }}
          placeholder="點選類別"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          options={[
            {
              value: "0",
              label: "火鍋",
            },
            {
              value: "1",
              label: "燒烤",
            },
            {
              value: "2",
              label: "牛排",
            },
            {
              value: "3",
              label: "甜點",
            },
            {
              value: "4",
              label: "小吃",
            },
            {
              value: "5",
              label: "早餐",
            },
          ]}
        />
      </div>
      <div className="flex">
        <div>
          {[...searchArray]
            .sort((a, b) => (a.totalStar > b.totalStar ? -1 : 1))
            .map((info, index) => {
              return (
                <div key={info.companyId} className="mr-20 flex pb-10 pl-10">
                  <div
                    className="w-64"
                    onClick={() => {
                      navigation(`/restaurant/${info.companyId}`);
                    }}
                  >
                    <img src={info.picture ? info.picture : tasty} />
                  </div>

                  <div className="w-64">
                    <h3
                      onClick={() => {
                        navigation(`/restaurant/${info.companyId}`);
                      }}
                    >
                      {index + 1}.{info.name}
                    </h3>
                    <p>
                      {info.city}
                      {info.district}
                      {info.address}
                    </p>
                    <p>{info.phone}</p>
                    <br />
                  </div>
                  <div>
                    <Rate disabled allowHalf defaultValue={info.totalStar} />
                  </div>
                  <div>{favoriteState(info.status)}</div>
                </div>
              );
            })}
        </div>
        <div className="pl-20">
          <MyGoogleMaps
            currentPosition={currentPosition}
            mapRef={mapRef}
            onLoad={onLoad}
            map={map}
            setMap={setMap}
            // redPin={redPin}
            // setRedPin={setRedPin}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;
