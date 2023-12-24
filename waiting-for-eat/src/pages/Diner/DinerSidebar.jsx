import React from "react";
import { BiSolidCommentDetail } from "react-icons/bi";
import { BsPersonFill } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { FaCalendarCheck } from "react-icons/fa";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { PiForkKnifeFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import useDinerStore from "../../stores/dinerStore.js";

function DinerSidebar() {
  const { userId } = useParams();
  const navigate = useNavigate();
  //   const [selectedDinerBar, setSelectedDinerBar] = useState("");
  const selectedDinerBar = useDinerStore((state) => state.selectedDinerBar);
  const setSelectedDinerBar = useDinerStore(
    (state) => state.setSelectedDinerBar,
  );

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap bg-zinc-600/70">
          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedDinerBar === "dinerInfo"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/dinerInfo/${userId}`);
              setSelectedDinerBar("diner");
            }}
          >
            <div>
              <BsPersonFill className="mx-auto mb-1 text-4xl" />
              <button>食客資訊</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedDinerBar === "reservedShop"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/reservedShop/${userId}`);
              setSelectedDinerBar("reserved");
            }}
          >
            <div>
              <FaCalendarCheck className="mx-auto mb-1 text-4xl" />
              <button>已預約餐廳</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedDinerBar === "eatenShop"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/eatenShop/${userId}`);
              setSelectedDinerBar("eaten");
            }}
          >
            <div>
              <PiForkKnifeFill className="mx-auto mb-1 text-4xl" />
              <button>吃過的餐廳</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedDinerBar === "likeShop"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/likeShop/${userId}`);
              setSelectedDinerBar("like");
            }}
          >
            <div>
              <HiThumbUp className="mx-auto mb-1 text-4xl" />
              <button>狠讚的餐廳</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedDinerBar === "dislikeShop"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/dislikeShop/${userId}`);
              setSelectedDinerBar("dislike");
            }}
          >
            <div>
              <HiThumbDown className="mx-auto mb-1 text-4xl" />
              <button>黑名單餐廳</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedDinerBar === "posted"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/posted/${userId}`);
              setSelectedDinerBar("posted");
            }}
          >
            <div>
              <CgNotes className="mx-auto mb-1 text-4xl" />
              <button>我的食記</button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white ${
              selectedDinerBar === "commented"
                ? "bg-zinc-800/80"
                : "duration-150 hover:bg-zinc-500"
            }`}
            onClick={() => {
              navigate(`/diner/commented/${userId}`);
              setSelectedDinerBar("commented");
            }}
          >
            <div>
              <BiSolidCommentDetail className="mx-auto mb-1 text-4xl" />
              <button>我的評論</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DinerSidebar;
