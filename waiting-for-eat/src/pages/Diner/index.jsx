import { Outlet } from "react-router-dom";
import DinerSidebar from "./DinerSidebar";

function Diner() {
  return (
    <>
      <div className="flex">
        <DinerSidebar />
        <div className="w-[1000px]">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Diner;
