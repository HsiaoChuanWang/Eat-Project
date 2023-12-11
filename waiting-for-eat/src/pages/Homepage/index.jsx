import { Form, Select } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "../../firebase";
import useSearchStore from "../../stores/searchStore";
import useUserStore from "../../stores/userStore";
import bbq from "./bbq.jpg";
import breakfast2 from "./breakfast2.jpg";
import hotpot from "./hotpot.jpg";
import mainPicture from "./mainPicture.png";
import smalleat from "./smalleat.jpg";
import steak from "./steak.jpg";
import sweet from "./sweet.jpg";

function HomePage() {
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [city, setCity] = useState([]);
  const userInfo = useUserStore((state) => state.userInfo);
  const companyRef = collection(db, "company");
  const navigate = useNavigate();

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
  function handleCategory(e) {
    setSearchArray([]);
    getCategory(e.target.title);
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
          const finalArray = resultArray.sort((a, b) =>
            a.totalStar > b.totalStar ? -1 : 1,
          );
          setSearchArray([...finalArray]);
        });
    });
    navigate(`/search`);
  }

  return (
    <div>
      <div>
        <img src={mainPicture} className="w-full" />
      </div>

      <div className="my-8">
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
                  className="h-10"
                  name="category"
                  onChange={(e) => setSearchName(e)}
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
              <button
                className="h-10 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white"
                onClick={handleRestaurant}
              >
                餐廳搜尋
              </button>
            </Form>
          </div>

          <div className="mx-8">
            <Form className="flex">
              <Form.Item className="rounded-lg border-2 border-solid border-[#ff6e06]">
                <Select
                  className="h-10"
                  name="category"
                  onChange={(e) => setSearchPlace(e)}
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
              <button
                className="h-10 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white"
                onClick={handlePlace}
              >
                搜尋地區
              </button>
            </Form>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="mb-8 flex max-w-[1440px] flex-wrap justify-center">
          <img
            className="mx-8 my-8 w-96 cursor-pointer"
            src={hotpot}
            title="0"
            onClick={(e) => handleCategory(e)}
          />
          <img
            className="mx-8 my-8 w-96 cursor-pointer"
            src={bbq}
            title="1"
            onClick={(e) => handleCategory(e)}
          />
          <img
            className="mx-8 my-8 w-96 cursor-pointer"
            src={steak}
            title="1"
            onClick={(e) => handleCategory(e)}
          />
          <img
            className="mx-8 my-8 w-96 cursor-pointer"
            src={smalleat}
            title="4"
            onClick={(e) => handleCategory(e)}
          />
          <img
            className="mx-8 my-8 w-96 cursor-pointer"
            src={sweet}
            title="1"
            onClick={(e) => handleCategory(e)}
          />
          <img
            className="mx-8 my-8 w-96 cursor-pointer"
            src={breakfast2}
            title="1"
            onClick={(e) => handleCategory(e)}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
