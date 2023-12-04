import React from "react";
import useUserStore from "../../stores/userStore";

function Posted({ setContent }) {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <div>
        <h1>po文</h1>
      </div>
    </>
  );
}

export default Posted;
