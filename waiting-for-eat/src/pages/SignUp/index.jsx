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
      <div>{signUpComponents[active]}</div>
    </>
  );
}

export default SignUp;
