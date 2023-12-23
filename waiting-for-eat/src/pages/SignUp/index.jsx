import { useState } from "react";
import StepFourBoss from "./StepFourBoss";
import StepFourDiner from "./StepFourDiner";
import StepOne from "./StepOne";
import StepThreeBoss from "./StepThreeBoss";
import StepThreeDiner from "./StepThreeDiner";
import StepTwo from "./StepTwo";

function SignUp() {
  const [active, setActive] = useState("StepOne");
  const [identity, setIdentity] = useState("");

  const signUpComponents = {
    StepOne: (
      <StepOne
        setActive={setActive}
        identity={identity}
        setIdentity={setIdentity}
      />
    ),
    StepTwo: <StepTwo setActive={setActive} identity={identity} />,
    StepThreeDiner: <StepThreeDiner setActive={setActive} />,
    StepThreeBoss: <StepThreeBoss setActive={setActive} />,
    StepFourDiner: <StepFourDiner />,
    StepFourBoss: <StepFourBoss />,
  };

  return (
    <>
      {/* <div className=" flex">
        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === "StepOne" && "bg-red-200"
          }`}
        >
          <Bs1CircleFill />
          選擇註冊身份
        </h2>

        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === "StepTwo" && "bg-red-200"
          }`}
        >
          <Bs2CircleFill />
          完成註冊
        </h2>

        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === ("StepThreeDiner" || "StepThreeBoss") && "bg-red-200"
          }`}
        >
          <Bs3CircleFill />
          填寫詳細資料
        </h2>

        <h2
          className={`mx-28 my-8  text-4xl  ${
            active === ("StepFourDiner" || "StepFourBoss") && "bg-red-200"
          }`}
        >
          <Bs4CircleFill />
          歡迎您加入"吃痴等待"
        </h2>
      </div> */}

      <div className="mflex justify-center">
        <div>{signUpComponents[active]}</div>
      </div>
    </>
  );
}

export default SignUp;
