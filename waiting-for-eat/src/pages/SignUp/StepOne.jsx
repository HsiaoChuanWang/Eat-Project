import React, { useState } from "react";

function StepOne({ setActive, setType, type }) {
  const [colorChange, setColorChange] = useState(true);

  function handleType(e) {
    setType(e.target.name);
    setColorChange(true);
  }

  function handleNext() {
    if (type === "") {
      alert("請點選註冊類別");
    } else {
      setActive("StepTwo");
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <h2 className="m-4 py-8 text-center text-2xl">請選擇註冊類別</h2>
        <button
          className={` m-4 block  border border-solid border-black py-8 text-2xl ${
            colorChange && type === "食客" ? " bg-red-300" : " bg-sky-200"
          }`}
          name="食客"
          onClick={(e) => handleType(e)}
        >
          食客
        </button>

        <button
          className={` m-4 block  border border-solid border-black py-8 text-2xl ${
            colorChange && type === "餐廳業主" ? " bg-red-300" : " bg-sky-200"
          }`}
          name="餐廳業主"
          onClick={(e) => handleType(e)}
        >
          餐廳業主
        </button>
      </div>

      <button
        className="my-8 ml-48 border-2 border-solid border-black text-xl"
        name="next"
        onClick={handleNext}
      >
        下一步
      </button>
    </>
  );
}

export default StepOne;
