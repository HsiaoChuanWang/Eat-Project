import React from "react";
import useUserStore from "../../stores/userStore";

function DinerInfoEdit({ setContent }) {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <div>
        <h1>食客資訊編輯</h1>
      </div>
    </>
  );
}

export default DinerInfoEdit;
