import { Outlet } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import BossSidebar from "./BossSidebar";

function Boss() {
  const detailInfo = useUserStore((state) => state.detailInfo);
  return (
    <>
      <div className="flex">
        <img src={detailInfo.picture} className="w-20"></img>
        <div>{`${detailInfo.userName} ，您好`}</div>
      </div>

      <div className="flex">
        <BossSidebar />
        <div className="w-[1500px]">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Boss;
