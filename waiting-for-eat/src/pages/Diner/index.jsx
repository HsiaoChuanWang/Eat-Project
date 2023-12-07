import { Outlet } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import DinerSidebar from "./DinerSidebar";

function Diner() {
  const detailInfo = useUserStore((state) => state.detailInfo);
  return (
    <>
      <div className="flex">
        <img src={detailInfo.picture} className="w-20"></img>
        <div>{`${detailInfo.userName} ，您好`}</div>
      </div>

      <div className="flex">
        <DinerSidebar />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Diner;
