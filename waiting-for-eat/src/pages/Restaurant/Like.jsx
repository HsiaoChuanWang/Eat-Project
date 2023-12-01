import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Like() {
  const { companyId } = useParams();
  const [totalLike, setTotalLike] = useState(0);
  const [like, setLike] = useState("");
  const [favoriteData, setFavoriteData] = useState({});
  const userInfo = useUserStore((state) => state.userInfo);
  const favoriteq = query(
    collection(db, "favorite"),
    where("userId", "==", userInfo.userId),
    where("companyId", "==", companyId),
  );
  const companyq = query(
    collection(db, "favorite"),
    where("companyId", "==", companyId),
  );

  useEffect(() => {
    if (userInfo) {
      getDocs(favoriteq)
        .then((quarySnaps) => {
          let favorites = [];
          quarySnaps.forEach((doc) => {
            const result = doc.data();
            const resultId = doc.id;
            const combineResult = { ...result, favoriteId: resultId };
            favorites.push(combineResult);
          });

          const IdSource = favorites[0];
          return IdSource;
        })
        .then((IdSource) => {
          setFavoriteData(IdSource);
        });

      onSnapshot(favoriteq, (querySnapshot) => {
        let favorites = [];
        querySnapshot.forEach((doc) => {
          favorites.push(doc.data().status);
        });
        setLike(favorites[0]);
      });

      onSnapshot(companyq, (querySnapshot) => {
        let totals = [];
        querySnapshot.forEach((doc) => {
          totals.push(doc.data().status);
        });
        const likes = totals.filter((data) => data === "like").length;
        setTotalLike(likes);
      });
    }
  }, [userInfo]);

  const handleLike = async (change) => {
    const favoriteRef = doc(db, "favorite", favoriteData.favoriteId);
    await updateDoc(favoriteRef, {
      status: change,
    });
  };

  const favoriteState = () => {
    switch (like) {
      case "like":
        return (
          <>
            <IconContext.Provider value={{ size: "50px" }}>
              <HiThumbUp onClick={() => handleLike("eaten")} />
            </IconContext.Provider>
            <p>Like!</p>
          </>
        );

      case "dislike":
        return (
          <>
            <IconContext.Provider
              value={{ size: "50px", backgroundColor: "black" }}
            >
              <HiThumbDown onClick={(e) => handleLike("eaten")} />
            </IconContext.Provider>
            <p>Oh No!</p>
          </>
        );

      case "eaten":
        return (
          <>
            <div className="flex">
              <IconContext.Provider value={{ size: "50px" }}>
                <HiOutlineThumbUp
                  title="noLike"
                  onClick={(e) => handleLike("like")}
                />
              </IconContext.Provider>
              <p>{totalLike}</p>

              <IconContext.Provider value={{ size: "50px" }}>
                <HiOutlineThumbDown onClick={(e) => handleLike("dislike")} />
              </IconContext.Provider>
            </div>
          </>
        );
    }
  };

  return <>{favoriteState()}</>;
}

export default Like;
