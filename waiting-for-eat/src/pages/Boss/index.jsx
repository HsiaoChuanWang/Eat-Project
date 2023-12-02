import React, { useState } from "react";
import useUserStore from "../../stores/userStore";
import BossInfo from "./BossInfo";
import BossInfoEdit from "./BossInfoEdit";
import OpenTime from "./OpenTime";
import Photo from "./Photo";
import PhotoUpload from "./PhotoUpload";
import Schedule from "./Schedule";
import Table from "./Table";
import TableSet from "./TableSet";

function Boss() {
  const detailInfo = useUserStore((state) => state.detailInfo);
  const [content, setContent] = useState("BossInfo");

  const switchContent = () => {
    switch (content) {
      case "BossInfo":
        return <BossInfo setContent={setContent} />;
      case "BossInfoEdit":
        return <BossInfoEdit setContent={setContent} />;
      case "Photo":
        return <Photo setContent={setContent} />;
      case "PhotoUpload":
        return <PhotoUpload setContent={setContent} />;
      case "OpenTime":
        return <OpenTime setContent={setContent} />;
      case "Table":
        return <Table setContent={setContent} />;
      case "TableSet":
        return <TableSet setContent={setContent} />;
      case "Schedule":
        return <Schedule setContent={setContent} />;
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
          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("BossInfo");
              }}
            >
              業者資訊
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("Photo");
              }}
            >
              編輯照片
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("OpenTime");
              }}
            >
              營業時間設定
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("Table");
              }}
            >
              桌位設定
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button
              onClick={() => {
                setContent("Schedule");
              }}
            >
              預約現況
            </button>
          </div>
        </div>

        <div className="px-20">{switchContent()}</div>
      </div>
    </>
  );
}

export default Boss;
