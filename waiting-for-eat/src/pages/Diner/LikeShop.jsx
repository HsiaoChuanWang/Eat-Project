import React from "react";
import useUserStore from "../../stores/userStore";

function LikeShop() {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <div>
        <h1>喜歡餐廳</h1>
      </div>
    </>
  );
}

export default LikeShop;
