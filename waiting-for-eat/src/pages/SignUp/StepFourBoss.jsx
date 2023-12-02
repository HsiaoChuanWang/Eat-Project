import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";

function StepFourBoss() {
  const navigate = useNavigate();
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
      <h2 className="mx-40 my-8 text-2xl">歡迎您加入"痴吃等待"!</h2>
      <h2 className="mx-40 my-8 text-2xl">We are waiting for you!</h2>
      <button
        className="my-8 ml-48 border-2 border-solid border-black text-xl"
        onClick={() => navigate(`/boss/${detailInfo.companyId}`)}
      >
        前往業者專區
      </button>
    </>
  );
}

export default StepFourBoss;
