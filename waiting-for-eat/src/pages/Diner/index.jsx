import React, { useState } from "react";
import useUserStore from "../../stores/userStore";
import DinerInfo from "./DinerInfo";
import DinerInfoEdit from "./DinerInfoEdit";
import DislikeShop from "./DislikeShop";
import EatenShop from "./EatenShop";
import LikeShop from "./LikeShop";
import Posted from "./Posted";
import PostedEdit from "./PostedEdit";
import ReservedShop from "./ReservedShop";

function Diner() {
  const detailInfo = useUserStore((state) => state.detailInfo);
  const [content, setContent] = useState("DinerInfo");

  const switchContent = () => {
    switch (content) {
      case "DinerInfo":
        return <DinerInfo setContent={setContent} />;
      case "DinerInfoEdit":
        return <DinerInfoEdit setContent={setContent} />;
      case "ReservedShop":
        return <ReservedShop />;
      case "EatenShop":
        return <EatenShop />;
      case "LikeShop":
        return <LikeShop />;
      case "DislikeShop":
        return <DislikeShop />;
      case "Posted":
        return <Posted setContent={setContent} />;
      case "PostedEdit":
        return <PostedEdit setContent={setContent} />;
    }
  };

  return (
    <>
      <div className="flex">
        <img src={detailInfo.picture} className="w-20"></img>
        <div>{`${detailInfo.userName} ，您好`}</div>
      </div>

      <div className="flex">
        <div className="w-1/5 bg-blue-200">
          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("DinerInfo");
              }}
            >
              食客資訊
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("ReservedShop");
              }}
            >
              已預約餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("EatenShop");
              }}
            >
              吃過的餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("LikeShop");
              }}
            >
              狠讚的餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("DislikeShop");
              }}
            >
              不好吃的餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("Posted");
              }}
            >
              我的食記
            </button>
          </div>
        </div>

        <div className=" w-full px-6">{switchContent()}</div>
      </div>
    </>
  );
}

export default Diner;
