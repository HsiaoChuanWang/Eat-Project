import React from "react";
import useUserStore from "../../stores/userStore";

function EatenShop() {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <div>
        <h1>吃過</h1>
      </div>
    </>
  );
}

export default EatenShop;
