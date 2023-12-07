import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function DinerSidebar() {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="mr-24 w-72">
        <div className=" bg-blue-200">
          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/diner/dinerInfo/${userId}`)}>
              食客資訊
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/diner/reservedShop/${userId}`)}>
              已預約餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/diner/eatenShop/${userId}`)}>
              吃過的餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/diner/likeShop/${userId}`)}>
              狠讚的餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/diner/dislikeShop/${userId}`)}>
              不好吃的餐廳
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/diner/posted/${userId}`)}>
              我的食記
            </button>
          </div>

          <div className="my-16 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/diner/commented/${userId}`)}>
              我的評論
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DinerSidebar;
