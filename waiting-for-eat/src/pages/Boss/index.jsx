import { Card } from "@nextui-org/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import RwdWarning from "../../components/RwdWarning";
import useBossStore from "../../stores/bossStore.js";
import BossSidebar from "./BossSidebar";

function Boss() {
  const setSelectedBossBar = useBossStore((state) => state.setSelectedBossBar);
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const secondParam = pathParts[2];
    setSelectedBossBar(secondParam);
  }, [location.pathname]);

  return (
    <div className="flex justify-center">
      <RwdWarning />
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
