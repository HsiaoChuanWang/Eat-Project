import React, { useEffect, useState } from "react";
import worker from "./worker.png";

const RwdWarning = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`${isSmallScreen === false && "hidden"}`}>
      <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-black/70">
        <div className="flex h-80 w-80 flex-col items-center justify-center rounded-lg bg-white">
          <img src={worker} className="mb-4 h-48" />

          <div className="flex flex-col items-center justify-center rounded-xl">
            <h1 className="mb-2 text-2xl font-black text-red-700">
              手機版調整中，暫不開放!
            </h1>
            <p className="mb-4 text-base">請使用電腦瀏覽以獲得最佳體驗</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RwdWarning;
