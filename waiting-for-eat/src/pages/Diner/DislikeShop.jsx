import React from "react";
import useUserStore from "../../stores/userStore";

function DislikeShop() {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <div>
        <h1>不愛餐廳</h1>
      </div>
    </>
  );
}

export default DislikeShop;
