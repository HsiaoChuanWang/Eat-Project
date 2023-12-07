import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function BossSidebar() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="mr-24 w-72">
        <div className=" bg-blue-200">
          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/boss/bossInfo/${companyId}`)}>
              業者資訊
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/boss/photo/${companyId}`)}>
              編輯照片
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/boss/activity/${companyId}`)}>
              編輯活動
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/boss/openTime/${companyId}`)}>
              營業時間設定
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/boss/table/${companyId}`)}>
              桌位設定
            </button>
          </div>

          <div className="my-20 flex h-12 w-full justify-center bg-red-200">
            <button onClick={() => navigate(`/boss/schedule/${companyId}`)}>
              預約現況
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BossSidebar;
