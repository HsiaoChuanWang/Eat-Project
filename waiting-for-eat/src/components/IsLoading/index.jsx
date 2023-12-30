import { default as React } from "react";
import loading from "./loading.png";

function IsLoading() {
  return (
    <div className="flex h-[calc(100vh-160px)] w-full items-center justify-center">
      <div className="w-80">
        <img src={loading} />
      </div>
      <div className=" #ff850e animate-pulse text-4xl font-black text-[#ff850e]">
        Loading...
      </div>
    </div>
  );
}

export default IsLoading;
