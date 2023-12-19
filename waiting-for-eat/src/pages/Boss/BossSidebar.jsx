import React from "react";
import { BsPersonFill } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { GiMeal } from "react-icons/gi";
import { IoTime } from "react-icons/io5";
import { MdNotificationsActive, MdPhotoLibrary } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import useBossStore from "../../stores/bossStore";

function BossSidebar() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  //   const [active, setActive] = useState("boss");
  const selected = useBossStore((state) => state.selected);
  const setSelected = useBossStore((state) => state.setSelected);

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap bg-zinc-600/70">
          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selected === "boss"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/bossInfo/${companyId}`);
              setSelected("boss");
            }}
          >
            <div>
              <BsPersonFill className="mx-auto mb-1 text-4xl" />
              <button>業者資訊</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selected === "photo"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/photo/${companyId}`);
              setSelected("photo");
            }}
          >
            <div>
              <MdPhotoLibrary className="mx-auto mb-1 text-4xl" />
              <button>編輯照片</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selected === "activity"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/activity/${companyId}`);
              setSelected("activity");
            }}
          >
            <div>
              <MdNotificationsActive className="mx-auto mb-1 text-4xl" />
              <button>編輯活動</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selected === "openTime"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/openTime/${companyId}`);
              setSelected("openTime");
            }}
          >
            <div>
              <IoTime className="mx-auto mb-1 text-4xl" />
              <button>用餐時間設定</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selected === "table"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/table/${companyId}`);
              setSelected("table");
            }}
          >
            <div>
              <GiMeal className="mx-auto mb-1 text-4xl" />
              <button>桌位設定</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selected === "schedule"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/boss/schedule/${companyId}`);
              setSelected("schedule");
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
