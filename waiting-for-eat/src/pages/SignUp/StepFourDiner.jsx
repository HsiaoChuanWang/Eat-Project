import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";

function StepFourDiner() {
  const navigate = useNavigate();
  const userInfo = useUserStore((state) => state.userInfo);

  return (
    <>
      <h2 className="mx-40 my-8 text-2xl">歡迎您加入"痴吃等待"!</h2>
      <h2 className="mx-40 my-8 text-2xl">We are waiting for you!</h2>
      <button
        className="my-8 ml-48 border-2 border-solid border-black text-xl"
        onClick={() => navigate(`/diner/dinerInfo/${userInfo.userId}`)}
      >
        前往食客專區
      </button>
      <button
        className="my-8 ml-48 border-2 border-solid border-black text-xl"
        onClick={() => navigate("/")}
      >
        返回首頁
      </button>
    </>
  );
}

export default StepFourDiner;
