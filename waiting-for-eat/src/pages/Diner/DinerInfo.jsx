import React from "react";
import { useParams } from "react-router-dom";
import useUserStore from "../../stores/userStore";

function DinerInfo({ setContent }) {
  const { userId } = useParams();
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <button
        onClick={() => {
          setContent("DinerInfoEdit");
        }}
        className="absolute right-0 border-2 border-solid border-black"
      >
        編輯
      </button>
      <div>
        <h1 className="text-2xl font-bold">食客資訊</h1>
        <div className="flex">
          <p className="my-6  text-xl">姓名</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{detailInfo.userName}</p>
        </div>

        <div className="flex">
          <p className="my-6  text-xl">性別</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">
            {detailInfo.gender === "小姐" ? "女" : "男"}
          </p>
        </div>

        <div className="flex">
          <p className="my-6  text-xl">電話</p>
          <p className="mx-4  my-6 text-xl">|</p>
          <p className="my-6  text-xl">{detailInfo.phone}</p>
        </div>

        <div className="flex">
          <p className="my-6  text-xl">大頭照</p>
          <p className="mx-4  my-6 text-xl">|</p>
          {detailInfo.picture === "" ? (
            <p>尚無上傳照片</p>
          ) : (
            <img src={detailInfo.picture} />
          )}
        </div>
      </div>
    </>
  );
}

export default DinerInfo;
