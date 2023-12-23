import React from "react";
import { Bs1CircleFill } from "react-icons/bs";
import boss from "./signUpPictures/boss.png";
import diner from "./signUpPictures/diner.png";
import stepOne from "./signUpPictures/stepOne.jpg";

function StepOne({ setActive, identity, setIdentity }) {
  function saveIdentity(identity) {
    setIdentity(identity);
  }

  function nextStep() {
    if (identity === "") {
      alert("請點選註冊類別");
    } else {
      setActive("StepTwo");
    }
  }

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <img src={stepOne} className="h-full w-3/5 object-cover object-center" />

      <div className="flex h-full w-2/5 items-center justify-center">
        <div
          className={`flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl`}
        >
          <div className="mb-12 flex items-center gap-2 text-3xl font-black text-[#ff850e]">
            <Bs1CircleFill />
            <h1>請選擇登入身份</h1>
          </div>
          <div
            onClick={() => saveIdentity("diner")}
            className={`${
              identity === "diner" && "bg-slate-300"
            } mb-8 flex cursor-pointer items-center rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-gray-600`}
          >
            <img src={diner} className="h-32" />
            <div className="mr-8 w-32 text-center">
              <h2 className="text-2xl font-bold">食客</h2>
              <h3 className=" text-base font-bold">Foodie</h3>
            </div>
          </div>

          <div
            onClick={() => saveIdentity("boss")}
            className={`${
              identity === "boss" && "bg-slate-300"
            } flex cursor-pointer items-center rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-gray-600`}
          >
            <div className="ml-8 w-32 text-center">
              <h2 className="text-2xl font-bold">餐廳業者</h2>
              <h3 className=" text-base font-bold">Owner</h3>
            </div>
            <img src={boss} className="h-32" />
          </div>

          <button
            className="mr-8 mt-16 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
            onClick={nextStep}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepOne;
