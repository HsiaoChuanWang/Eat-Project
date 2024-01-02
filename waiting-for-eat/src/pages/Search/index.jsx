import { Button, Image, ScrollShadow } from "@nextui-org/react";
import { useLoadScript } from "@react-google-maps/api";
import { Form, Rate, Select } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import IsLoading from "../../components/IsLoading";
import NoItem from "../../components/NoItem";
import db from "../../firebase";
import useSearchStore from "../../stores/searchStore.js";
import useUserStore from "../../stores/userStore.js";
import MyGoogleMaps from "./MyGoogleMaps";
import tasty from "./tasty.jpg";

const libraries = ["places"];

function Search() {
  const [isLoading, setIsLoading] = useState(true);
  const userId = useUserStore((state) => state.userId);
  const searchArray = useSearchStore((state) => state.searchArray);
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const navigation = useNavigate();

  async function getfavorite(companyId) {
    const favoriteq = query(
      collection(db, "favorite"),
      where("companyId", "==", companyId),
      where("userId", "==", userId),
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

  //四、設定初始地圖畫面之經緯度，使用useMemo(dependencies[])控制只渲染一次
  const defaultCenter = useMemo(
    () => ({
      lat: 25.0492576,
      lng: 121.5171959,
    }),
    [],
  );

  //五、設定取得input後的值，該如何變化
  // map是google map的物件，設置state的變化去追蹤它的變化
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [restaurants, setRestaurants] = useState([]);
  const [city, setCity] = useState([]);
  const companyRef = collection(db, "company");

  useEffect(() => {
    let companyList = [];
    getDocs(collection(db, "company")).then((result) => {
      result.forEach((doc) => {
        const result = doc.data();
        const resultId = doc.id;
        const combine = { ...result, companyId: resultId };
        companyList.push(combine);
      });
      const shopList = [];
      const cityList = [];
      companyList.forEach((shop) => {
        shopList.push({ label: shop.name, value: shop.name });
        cityList.push({ label: shop.city, value: shop.city });
      });
      setRestaurants(shopList);
      const newCityList = Array.from(
        new Set(cityList.map((item) => JSON.stringify(item))),
      ).map((item) => JSON.parse(item));
      setCity(newCityList);
      setIsLoading(false);
    });
  }, []);

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
          const finalArray = resultArray.sort((a, b) =>
            a.totalStar > b.totalStar ? -1 : 1,
          );
          setSearchArray([...finalArray]);
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
          const finalArray = resultArray.sort((a, b) =>
            a.totalStar > b.totalStar ? -1 : 1,
          );
          const first = finalArray[0];
          setCurrentPosition({
            lat: first.lat,
            lng: first.lng,
          });
          setSearchArray([...finalArray]);
        });
    });
  }

  function handlePlace() {
    setSearchArray([]);
    getPlace(searchPlace);
  }

  //取得所有種類
  function handleCategory() {
    setSearchArray([]);
    getCategory(searchCategory);
  }

  async function getCategory(item) {
    const qq = query(companyRef, where("category", "==", item));
    const querySnapshotC = await getDocs(qq);

    let dataList = [];
    querySnapshotC.forEach((doc) => {
      const data = doc.data();
      const dataId = doc.id;
      const newData = { ...data, companyId: dataId, status: status };
      dataList.push(newData);
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
          const finalArray = resultArray.sort((a, b) => {
            if (a.totalStar === b.totalStar) {
              return a.companyId > b.companyId ? -1 : 1;
            } else {
              return a.totalStar > b.totalStar ? -1 : 1;
            }
          });
          const first = finalArray[0];
          setCurrentPosition({
            lat: first.lat,
            lng: first.lng,
          });
          setSearchArray([...finalArray]);
        });
    });
  }

  const favoriteState = (status) => {
    switch (status) {
      case "like":
        return (
          <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1">
              <IconContext.Provider value={{ size: "20px" }}>
                <HiThumbUp />
              </IconContext.Provider>
            </div>
            <p className="mr-1">|</p>
            <div>
              <IconContext.Provider value={{ size: "20px" }}>
                <HiOutlineThumbDown />
              </IconContext.Provider>
            </div>
          </div>
        );

      case "dislike":
        return (
          <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1">
              <IconContext.Provider value={{ size: "20px" }}>
                <HiOutlineThumbUp title="noLike" />
              </IconContext.Provider>
            </div>
            <p className="mr-1">|</p>
            <div className="mr-1">
              <IconContext.Provider
                value={{ size: "20px", backgroundColor: "black" }}
              >
                <HiThumbDown />
              </IconContext.Provider>
            </div>
          </div>
        );

      case "eaten":
        return (
          <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="flex items-center justify-center">
              <div className="mr-1">
                <IconContext.Provider value={{ size: "20px" }}>
                  <HiOutlineThumbUp title="noLike" />
                </IconContext.Provider>
              </div>
              <p className="mr-1">|</p>
              <div>
                <IconContext.Provider value={{ size: "20px" }}>
                  <HiOutlineThumbDown />
                </IconContext.Provider>
              </div>
            </div>
          </div>
        );

      case "":
        return;
    }
  };

  if (!isLoaded) {
    return <IsLoading />;
  }

  return (
    <div>
      <div className="mb-2 mt-8 flex">
        <div className="">
          <Form className="ml-10 mr-4 flex">
            <Form.Item>
              <Select
                className="h-10 rounded-lg border-2 border-solid border-[#ff6e06]"
                name="category"
                onChange={(e) => {
                  setSearchName(e);
                  setSearchPlace("");
                  setSearchCategory("");
                }}
                value={searchName}
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="搜尋餐廳"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                options={restaurants}
              />
            </Form.Item>
            <Button
              className="ml-1 h-10 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white"
              onClick={handleRestaurant}
            >
              搜尋餐廳
            </Button>
          </Form>
        </div>

        <div>
          <Form className="mx-4 flex">
            <Form.Item>
              <Select
                className="h-10 rounded-lg border-2 border-solid border-[#ff6e06]"
                name="category"
                onChange={(e) => {
                  setSearchPlace(e);
                  setSearchName("");
                  setSearchCategory("");
                }}
                value={searchPlace}
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="搜尋餐廳"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                options={city}
              />
            </Form.Item>
            <Button
              className="ml-1 h-10 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white"
              onClick={handlePlace}
            >
              搜尋地區
            </Button>
          </Form>
        </div>

        <div>
          <Form className="mx-4 flex">
            <Form.Item>
              <Select
                className="h-10 rounded-lg border-2 border-solid border-[#ff6e06]"
                name="category"
                onChange={(e) => {
                  setSearchCategory(e);
                  setSearchName("");
                  setSearchPlace("");
                }}
                value={searchCategory}
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="搜尋餐廳"
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
            </Form.Item>
            <Button
              className="ml-1 h-10 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white"
              onClick={handleCategory}
            >
              搜尋類別
            </Button>
          </Form>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)] justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.16)]">
        <div className="shadow-4xl w-[28%]">
          <ScrollShadow className="h-full w-full">
            {searchArray.length === 0 ? (
              <NoItem
                content="尚無相關餐廳進駐"
                distance="calc(100%-36px)"
                pictureWidth="w-44"
                textSize="lg"
              />
            ) : (
              [...searchArray].map((info, index) => {
                return (
                  <div
                    key={info.companyId}
                    className="flex items-center justify-between border-b border-solid border-black p-4"
                  >
                    <div>
                      <div>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            navigation(`/restaurant/${info.companyId}`);
                          }}
                        >
                          <div className="mr-1 inline border border-solid border-gray-400 bg-gray-200 px-1 font-bold">
                            {index + 1}
                          </div>
                          <h3 className="inline text-lg font-bold">
                            {info.name}
                          </h3>
                        </div>
                        <div>
                          <h3 className="ml-6 mr-2 inline text-sm text-gray-600">
                            {info.totalStar.toFixed(1)}
                          </h3>
                          <Rate
                            className="text-sm"
                            disabled
                            allowHalf
                            defaultValue={info.totalStar}
                          />
                        </div>
                      </div>

                      <p className="mb-1 ml-6 text-sm text-gray-600">
                        {info.city}
                        {info.district}
                        {info.address}
                      </p>
                      <p className="mb-1 ml-6 text-sm text-gray-600">
                        {info.phone}
                      </p>
                      <div className="ml-6">{favoriteState(info.status)}</div>
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        navigation(`/restaurant/${info.companyId}`);
                      }}
                    >
                      <div>
                        <Image
                          isBlurred
                          style={{ width: "100px", height: "100px" }}
                          className="object-cover object-center"
                          src={info.picture ? info.picture : tasty}
                          alt="NextUI Album Cover"
                          classNames="m-5"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </ScrollShadow>
        </div>
        <div className=" w-[72%]">
          <MyGoogleMaps
            currentPosition={currentPosition}
            mapRef={mapRef}
            onLoad={onLoad}
            map={map}
            setMap={setMap}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;
