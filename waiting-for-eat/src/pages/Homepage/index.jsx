import { Button, Form, Select } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "../../firebase";
import useSearchStore from "../../stores/searchStore";
import useUserStore from "../../stores/userStore";
import bbq from "./bbq.jpg";
import hotpot from "./hotpot.jpg";
import smalleat from "./smalleat.jpg";

function HomePage() {
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
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
      const categoryList = [];
      companyList.forEach((shop) => {
        shopList.push({ label: shop.name, value: shop.name });
        categoryList.push({ label: shop.category, value: shop.category });
      });
      setRestaurants(shopList);
      setCategories(categoryList);
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
          setSearchArray([...resultArray]);
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
          setSearchArray([...resultArray]);
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
          setSearchArray([...resultArray]);
        });
    });
    navigate(`/search`);
  }

  return (
    <div>
      <div className=" flex h-96 w-full justify-center bg-slate-200 py-48">
        <div>
          <input
            className=" border-2 border-solid border-black"
            value={searchName}
            placeholder="搜尋餐廳"
            onChange={(e) => setSearchName(e.target.value)}
          ></input>
          <button
            className="mr-4 border-2 border-solid border-black"
            onClick={handleRestaurant}
          >
            按我
          </button>

          <div>
            <Form>
              <Form.Item>
                <Select
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
              <Button
                className="bg-[#1677ff]"
                onClick={handleRestaurant}
                type="primary"
                htmlType="button"
              >
                Submit
              </Button>
            </Form>
          </div>

          <input
            className="border-2 border-solid border-black"
            value={searchPlace}
            placeholder="搜尋地點"
            onChange={(e) => setSearchPlace(e.target.value)}
          ></input>
          <button
            className="border-2 border-solid border-black"
            onClick={handlePlace}
          >
            按我
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <img
          className="m-20 w-96"
          src={hotpot}
          title="0"
          onClick={(e) => handleCategory(e)}
        />
        <img
          className="m-20 w-96"
          src={bbq}
          title="1"
          onClick={(e) => handleCategory(e)}
        />
        <img
          className="m-20 w-96"
          src={smalleat}
          title="4"
          onClick={(e) => handleCategory(e)}
        />
      </div>
    </div>
  );
}

export default HomePage;
