import { Card } from "@nextui-org/react";
import { Outlet } from "react-router-dom";
import BossSidebar from "./BossSidebar";

function Boss() {
  return (
    <div className="flex justify-center ">
      <Card className="mt-8 h-[calc(100vh-176px)] w-full max-w-[1300px] border-2 border-solid border-gray-300 shadow-[-8px_0_4px_2px_rgba(0,0,0,0.16)]">
        <div className="flex w-full">
          <div className="w-1/5">
            <BossSidebar />
          </div>

          <div className="w-4/5 ">
            <Outlet />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Boss;
