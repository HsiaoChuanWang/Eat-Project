import React from "react";
import { BsPersonFill } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { GiMeal } from "react-icons/gi";
import { IoTime } from "react-icons/io5";
import { MdNotificationsActive, MdPhotoLibrary } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import useBossStore from "../../stores/bossStore.js";

function BossSidebar() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const selectedBossBar = useBossStore((state) => state.selectedBossBar);
  const setSelectedBossBar = useBossStore((state) => state.setSelectedBossBar);

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap bg-zinc-600/70">
          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedBossBar === "bossInfo" ||
              selectedBossBar === "bossInfoEdit"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/bossInfo/${companyId}`);
              setSelectedBossBar("bossInfo");
            }}
          >
            <div>
              <BsPersonFill className="mx-auto mb-1 text-4xl" />
              <button>業者資訊</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedBossBar === "photo" || selectedBossBar === "photoUpload"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/photo/${companyId}`);
              setSelectedBossBar("photo");
            }}
          >
            <div>
              <MdPhotoLibrary className="mx-auto mb-1 text-4xl" />
              <button>編輯照片</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedBossBar === "activity" ||
              selectedBossBar === "activityEdit"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/activity/${companyId}`);
              setSelectedBossBar("activity");
            }}
          >
            <div>
              <MdNotificationsActive className="mx-auto mb-1 text-4xl" />
              <button>編輯活動</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedBossBar === "openTime"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/openTime/${companyId}`);
              setSelectedBossBar("openTime");
            }}
          >
            <div>
              <IoTime className="mx-auto mb-1 text-4xl" />
              <button>用餐時間設定</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedBossBar === "table"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/table/${companyId}`);
              setSelectedBossBar("table");
            }}
          >
            <div>
              <GiMeal className="mx-auto mb-1 text-4xl" />
              <button>桌位設定</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedBossBar === "schedule"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/schedule/${companyId}`);
              setSelectedBossBar("schedule");
            }}
          >
            <div>
              <FaRegCalendarCheck className="mx-auto mb-1 text-4xl" />
              <button>預約現況</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BossSidebar;
