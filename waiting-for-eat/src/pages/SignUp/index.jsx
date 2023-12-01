import { useState } from "react";
import StepFour from "./StepFour";
import StepOne from "./StepOne";
import StepThreeBoss from "./StepThreeBoss";
import StepThreeDiner from "./StepThreeDiner";
import StepTwo from "./StepTwo";

function SignUp() {
  const [active, setActive] = useState("StepOne");
  const [type, setType] = useState("");

  const renderContent = () => {
    switch (active) {
      case "StepOne":
        return <StepOne setActive={setActive} setType={setType} type={type} />;
      case "StepTwo":
        return <StepTwo setActive={setActive} type={type} />;
      case "StepThreeDiner":
        return <StepThreeDiner setActive={setActive} />;
      case "StepThreeBoss":
        return <StepThreeBoss setActive={setActive} />;
      case "StepFour":
        return <StepFour />;
    }
  };

  return (
    <>
      <div className=" flex">
        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === "StepOne" && "bg-red-200"
          }`}
        >
          1、選擇註冊類別
        </h2>

        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === "StepTwo" && "bg-red-200"
          }`}
        >
          2、註冊帳號
        </h2>

        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === ("StepThreeDiner" || "StepThreeBoss") && "bg-red-200"
          }`}
        >
          3、填寫詳細資料
        </h2>

        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === "StepFour" && "bg-red-200"
          }`}
        >
          4、完成註冊
        </h2>
      </div>

      <div className="my-20 flex justify-center">
        <div className=" w-[600px] border-4 border-solid border-gray-300">
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default SignUp;
