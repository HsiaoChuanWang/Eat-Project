import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "../../firebase";
import useSearchStore from "../../stores/searchStore";
import bbq from "./bbq.jpg";
import hotpot from "./hotpot.jpg";

function HomePage() {
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const companyRef = collection(db, "company");
  const navigate = useNavigate();

  //搜尋特定一間店的店名
  async function getRestaurant(searchitem) {
    const q = query(companyRef, where("name", "==", searchitem));
    const querySnapshot = await getDocs(q);

    let dataList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataList.push(data);
    });
    setSearchArray(dataList);
    navigate(`/search`);
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
    });
    setSearchArray(dataList);
    navigate(`/search`);
  }

  function handlePlace() {
    getPlace(searchPlace);
  }

  //照片選擇食物類別
  function handleCategory(e) {
    getCategory(e.target.title);
  }

  async function getCategory(item) {
    const categoryRef = collection(db, "category");
    const q = query(categoryRef, where("type", "==", item));
    const querySnapshot = await getDocs(q);

    let selectedCategory;
    querySnapshot.forEach((doc) => {
      selectedCategory = doc.id;
    });

    const qq = query(companyRef, where("category", "==", selectedCategory));
    const querySnapshotC = await getDocs(qq);

    let dataList = [];
    querySnapshotC.forEach((doc) => {
      const data = doc.data();
      dataList.push(data);
    });
    setSearchArray(dataList);
    navigate(`/search`);
  }

  return (
    <div>
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

      <img
        className="m-20 w-96"
        src={hotpot}
        title="火鍋"
        onClick={(e) => handleCategory(e)}
      />
      <img
        className="m-20 w-96"
        src={bbq}
        title="燒烤"
        onClick={(e) => handleCategory(e)}
      />
    </div>
  );
}

export default HomePage;
