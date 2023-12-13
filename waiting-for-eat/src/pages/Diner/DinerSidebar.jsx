import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DinerSidebar() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("diner");
  console.log(active);

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap bg-zinc-600/70">
          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "diner"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/dinerInfo/${userId}`);
              setActive("diner");
            }}
          >
            <button>食客資訊</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "reserved"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/reservedShop/${userId}`);
              setActive("reserved");
            }}
          >
            <button>已預約餐廳</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "eaten"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/eatenShop/${userId}`);
              setActive("eaten");
            }}
          >
            <button>吃過的餐廳</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "like"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/likeShop/${userId}`);
              setActive("like");
            }}
          >
            <button>狠讚的餐廳</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "dislike"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/dislikeShop/${userId}`);
              setActive("dislike");
            }}
          >
            <button>黑名單餐廳</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "posted"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/posted/${userId}`);
              setActive("posted");
            }}
          >
            <button>我的食記</button>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer justify-center border-b border-solid border-gray-400 text-2xl font-black text-white ${
              active === "commented"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/commented/${userId}`);
              setActive("commented");
            }}
          >
            <button>我的評論</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DinerSidebar;
