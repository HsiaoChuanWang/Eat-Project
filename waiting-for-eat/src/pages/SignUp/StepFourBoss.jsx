import { Link } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import cook from "./signUpPictures/cook.png";
import stepFour from "./signUpPictures/stepFour.jpg";

function StepFourBoss() {
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <img src={stepFour} className="h-full w-3/5 object-cover object-center" />

      <div className="flex h-full w-2/5 items-center justify-center">
        <div
          className={`flex h-[520px] w-[480px] flex-col items-center justify-center rounded-2xl`}
        >
          <h2 className="mb-8 animate-bounce text-4xl font-bold text-[#ff850e]">
            \ 歡迎您加入"痴吃等待"! /
          </h2>
          <div className="mb-8 flex items-center">
            <img src={cook} className="w-72" />
            <div className="font-black">
              <h2 className="text-3xl">We are</h2>
              <h2 className="text-3xl">waiting for</h2>
              <h2 className="text-3xl">you!</h2>
            </div>
          </div>

          <Link
            to={`/boss/bossInfo/${detailInfo.companyId}`}
            className="h-10 w-36 rounded-lg bg-[#ff850e] text-center font-bold leading-10 text-white hover:bg-[#ff850e]/80"
          >
            前往業者專區
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StepFourBoss;
