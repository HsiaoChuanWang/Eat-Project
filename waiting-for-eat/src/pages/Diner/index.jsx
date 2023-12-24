import { Card } from "@nextui-org/react";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useDinerStore from "../../stores/dinerStore.js";
import DinerSidebar from "./DinerSidebar";

function Diner() {
  const setSelectedDinerBar = useDinerStore(
    (state) => state.setSelectedDinerBar,
  );
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const secondParam = pathParts[2];
    setSelectedDinerBar(secondParam);
  }, [location.pathname]);

  return (
    <div className="flex justify-center">
      <Card className="mt-8 h-[calc(100vh-176px)] w-full max-w-[1300px] border-2 border-solid border-gray-300 shadow-[-8px_0_4px_2px_rgba(0,0,0,0.16)]">
        <div className="flex w-full">
          <div className="w-1/5">
            <DinerSidebar />
          </div>

          <div className="w-4/5">
            <Outlet />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Diner;
