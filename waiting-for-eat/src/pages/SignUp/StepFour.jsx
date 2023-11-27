import { useNavigate } from "react-router-dom";

function StepFour() {
  const navigate = useNavigate();
  return (
    <>
      <h2 className="mx-40 my-8 text-2xl">註冊完成!</h2>
      <h2 className="mx-40 my-8 text-2xl">請重新登入</h2>
      <button
        className="my-8 ml-48 border-2 border-solid border-black text-xl"
        // onClick={navigate("/")}
      >
        重新登入
      </button>
    </>
  );
}

export default StepFour;
