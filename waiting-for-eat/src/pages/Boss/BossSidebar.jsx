import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BossSidebar() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("boss");

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap bg-zinc-600/70">
          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "boss"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/bossInfo/${companyId}`);
              setActive("boss");
            }}
          >
            <button>業者資訊</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "photo"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/photo/${companyId}`);
              setActive("photo");
            }}
          >
            <button>編輯照片</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "activity"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/activity/${companyId}`);
              setActive("activity");
            }}
          >
            <button>編輯活動</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "openTime"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/openTime/${companyId}`);
              setActive("openTime");
            }}
          >
            <button>用餐時間設定</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "table"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/table/${companyId}`);
              setActive("table");
            }}
          >
            <button>桌位設定</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "schedule"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/schedule/${companyId}`);
              setActive("schedule");
            }}
          >
            <button>預約現況</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BossSidebar;
