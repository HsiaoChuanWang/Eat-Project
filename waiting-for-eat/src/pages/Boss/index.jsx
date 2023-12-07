import { Outlet } from "react-router-dom";
import BossSidebar from "./BossSidebar";

function Boss() {
  return (
    <>
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
