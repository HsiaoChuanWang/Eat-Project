import { Button } from "@nextui-org/react";
import { Form, Select } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import db from "../../firebase";
import useSearchStore from "../../stores/searchStore";
import useUserStore from "../../stores/userStore.js";
import Carousel from "./Carousel";
import bbq from "./homepagePictures/bbq.jpg";
import boss from "./homepagePictures/boss.png";
import breakfast from "./homepagePictures/breakfast.jpg";
import diner from "./homepagePictures/diner.png";
import hotpot from "./homepagePictures/hotpot.jpg";
import steak from "./homepagePictures/steak.jpg";
import streetFood from "./homepagePictures/streetFood.jpg";
import sweet from "./homepagePictures/sweet.jpg";

function HomePage() {
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [city, setCity] = useState([]);
  const userId = useUserStore((state) => state.userId);
  const companyRef = collection(db, "company");
  const navigate = useNavigate();
  const scrollRef = useRef();

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
    });
  }, []);

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
    navigate(`/search`);
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
          setSearchArray([...finalArray]);
        });
    });
    navigate(`/search`);
  }

  function handlePlace() {
    setSearchArray([]);
    getPlace(searchPlace);
  }

  //照片選擇食物類別
  function handleCategory(name) {
    setSearchArray([]);
    getCategory(name);
  }

  async function getCategory(item) {
    const qq = query(companyRef, where("category", "==", item));
    const querySnapshotC = await getDocs(qq);

    let dataList = [];
    querySnapshotC.forEach((doc) => {
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
          const finalArray = resultArray.sort((a, b) => {
            if (a.totalStar === b.totalStar) {
              return a.companyId > b.companyId ? -1 : 1;
            } else {
              return a.totalStar > b.totalStar ? -1 : 1;
            }
          });
          setSearchArray([...finalArray]);
        });
    });
    navigate(`/search`);
  }

  const handleClick = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="relative">
        <Carousel />
        <div className="absolute bottom-0 h-[400px] w-full bg-black/30"></div>
        <div className="absolute bottom-12 right-48 items-center justify-center">
          <div className="text-white/90">
            <h1 className="text-right text-5xl font-bold">痴吃等待</h1>
            <h1 className="text-right text-2xl font-bold">Waiting for eat</h1>
            <h1 className="text-right text-xl font-black">
              這個世界除了筷子，什麼都可以放下
            </h1>

            <div
              className="mt-2 flex cursor-pointer justify-end"
              onClick={handleClick}
            >
              <IoIosArrowDropdownCircle className="animate-[bounce_1s_infinite] text-3xl text-white " />
              <h1 className="ml-2 text-lg font-bold">開始查詢餐廳</h1>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        whileInView={{ x: 0, opacity: 1 }}
        transition={{
          ease: "linear",
          duration: 0.5,
        }}
        initial={{ x: -50, opacity: 0 }}
        className="mt-24 flex items-center justify-center"
      >
        <div>
          <img className="h-[240px]" src={diner}></img>
        </div>

        <div className="ml-16 leading-8">
          <div className="mb-2 text-2xl font-bold">
            <span>動動手指，</span>
            <span className="text-[#ff6e06]">探索你所不知道的熱門美食。</span>
          </div>

          <div className="text-gray-600">
            <h1>以店名、地區、食物種類快速搜尋餐廳，</h1>
            <h1>查看相關評論及食記，準確下訂感興趣的餐廳，</h1>
            <h1>記錄每間吃過的餐廳，避免再度光臨不合口味的餐廳。</h1>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileInView={{ x: 0, opacity: 1 }}
        transition={{
          ease: "linear",
          duration: 0.5,
        }}
        initial={{ x: 50, opacity: 0 }}
        className="mt-24 flex items-center justify-center"
      >
        <div className="mr-16 leading-8">
          <div className="mb-2 text-2xl font-bold">
            <span>敲敲鍵盤，</span>
            <span className="text-[#ff6e06]">輕鬆上架你的餐廳。</span>
          </div>

          <div className="text-gray-600">
            <h1>編輯相關資訊、菜單、活動，</h1>
            <h1>指定各時段可訂位人數，</h1>
            <h1>使用日曆查看每天預約狀況。</h1>
          </div>
        </div>

        <div>
          <img className="h-[240px]" src={boss}></img>
        </div>
      </motion.div>

      <div className="h-24" ref={scrollRef}></div>

      <div className="py-8">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold">Waiting for Eat?</h1>
        </div>

        <div className="flex justify-center">
          <h1 className="text-xl font-bold">註冊會員 訂位想要的餐廳</h1>
        </div>
      </div>

      <div className=" flex  w-full justify-center">
        <div className="flex">
          <div className="mx-8">
            <Form className="flex">
              <Form.Item className="rounded-lg border-2 border-solid border-[#ff6e06]">
                <Select
                  placeholder="搜尋餐廳"
                  className="h-10"
                  onChange={(e) => {
                    setSearchName(e);
                    setSearchPlace("");
                  }}
                  value={searchName}
                  showSearch
                  style={{
                    width: 200,
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  options={restaurants}
                />
              </Form.Item>
              <Button
                className="ml-1 h-11 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white"
                onClick={handleRestaurant}
              >
                餐廳搜尋
              </Button>
            </Form>
          </div>

          <div className="mx-8">
            <Form className="flex">
              <Form.Item className="rounded-lg border-2 border-solid border-[#ff6e06]">
                <Select
                  className="h-10"
                  name="category"
                  onChange={(e) => {
                    setSearchPlace(e);
                    setSearchName("");
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
                className="ml-1 h-11 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white"
                onClick={handlePlace}
              >
                搜尋地區
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="mb-8 flex max-w-[1440px] flex-wrap justify-center">
          <div
            onClick={() => handleCategory("0")}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out"
              src={hotpot}
              //   title="0"
            />
            <div className="absolute h-full w-full bg-black/30"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">火鍋</h1>
              <h2 className="text-lg font-black">HOTPOT</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory("1")}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out"
              src={bbq}
              //   title="0"
            />
            <div className="absolute h-full w-full bg-black/30"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">燒烤</h1>
              <h2 className="text-lg font-black">BARBECUE</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory("2")}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out"
              src={steak}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">牛排</h1>
              <h2 className="text-lg font-black">STEAKHOUSE</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory("3")}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out"
              src={sweet}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">甜點</h1>
              <h2 className="text-lg font-black">DESSERT</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory("4")}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out"
              src={streetFood}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">小吃</h1>
              <h2 className="text-lg font-black">STREET FOOD</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory("5")}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out"
              src={breakfast}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">早餐</h1>
              <h2 className="text-lg font-black">BREAKFAST</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
