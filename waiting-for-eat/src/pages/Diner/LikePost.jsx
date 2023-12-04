import React from "react";
import useUserStore from "../../stores/userStore";

function LikePost() {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <div>
        <h1>喜歡的p文</h1>
      </div>
    </>
  );
}

export default LikePost;
