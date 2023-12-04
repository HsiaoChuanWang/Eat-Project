import React from "react";
import useUserStore from "../../stores/userStore";

function PostedEdit({ setContent }) {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <div>
        <h1>編輯po文</h1>
      </div>
    </>
  );
}

export default PostedEdit;
