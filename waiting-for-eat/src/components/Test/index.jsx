import { default as React } from "react";
import { CgCloseO } from "react-icons/cg";
import { TiArrowSortedDown } from "react-icons/ti";
import { Link } from "react-router-dom";
import boss from "../../pages/SignUp/signUpPictures/boss.png";
import diner from "../../pages/SignUp/signUpPictures/diner.png";
import useHeaderStore from "../../stores/headerStore";
import useTestStore from "../../stores/testStore";
import test from "./test.png";

function Test() {
  const isTestShowed = useTestStore((state) => state.isTestShowed);
  const setisTestShowed = useTestStore((state) => state.setisTestShowed);
  const setLoginIdentity = useTestStore((state) => state.setLoginIdentity);
  const setTestAccount = useTestStore((state) => state.setTestAccount);
  const setTestPassword = useTestStore((state) => state.setTestPassword);
  const loginStatus = useHeaderStore((state) => state.loginStatus);

  function showTest() {
    if (isTestShowed === true) {
      setisTestShowed(false);
    } else {
      setisTestShowed(true);
    }
    setTestAccount("");
    setTestPassword("");
    setLoginIdentity("");
  }

  function testDiner() {
    setTestAccount("diner168@mail.com");
    setTestPassword("168168");
    setLoginIdentity("diner");
  }

  function testBoss() {
    setTestAccount("boss888@mail.com");
    setTestPassword(888888);
    setLoginIdentity("boss");
  }

  return (
    <div className="phone:absolute phone:z-20">
      <div
        className={`${
          (isTestShowed === false || loginStatus !== "LogOut") && "hidden"
        } fixed bottom-0 flex h-[calc(100%-96px)] w-full items-center justify-center bg-black/40`}
      >
        <div className="ml-8 flex h-[430px] w-[600px] flex-col items-center justify-between rounded-2xl bg-white phone:h-[420px] phone:w-72 tablet:w-96 laptop:w-96">
          <div className="w-full">
            <div className="w-full rounded-t-2xl bg-[#ff850e] py-4 text-center font-bold ">
              <h1 className="text-2xl text-white">想快速測試所有功能?</h1>
            </div>

            <div className="mt-4 flex items-center justify-center font-bold">
              <TiArrowSortedDown className="mr-1 animate-bounce text-xl" />
              <h2 className="text-base text-black tablet:text-sm laptop:text-sm">
                點擊下方選項，快速登入測試!
              </h2>
            </div>
          </div>

          <Link
            to="/login"
            onClick={testDiner}
            className="flex w-96 cursor-pointer items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-300 phone:my-4 phone:h-32 phone:w-32 phone:flex-col tablet:w-72 laptop:w-72"
          >
            <img
              className="w-40 phone:w-24 tablet:w-36 laptop:w-36"
              src={diner}
            />
            <h3 className="w-36 text-xl font-bold phone:w-full phone:pt-2 phone:text-center phone:text-sm tablet:text-lg laptop:text-lg">
              體驗"食客"
            </h3>
          </Link>

          <Link
            to="/login"
            onClick={testBoss}
            className="mb-8 flex w-96 cursor-pointer items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-300 phone:mb-4 phone:h-32 phone:w-32 phone:flex-col tablet:w-72 laptop:w-72"
          >
            <img
              className="w-44 phone:w-24 tablet:w-36 laptop:w-36"
              src={boss}
            />
            <h3 className="w-36 text-xl font-bold phone:w-full phone:pt-2  phone:text-center phone:text-sm tablet:text-lg laptop:text-lg">
              體驗"餐廳業者"
            </h3>
          </Link>
        </div>

        <CgCloseO
          onClick={showTest}
          className="mb-[500px] cursor-pointer text-3xl text-white phone:mb-[500px] laptop:mb-[500px]"
        />
      </div>

      <div
        onClick={showTest}
        className={`${
          (isTestShowed === true || loginStatus !== "LogOut") && "hidden"
        } fixed bottom-8 left-8 flex cursor-pointer flex-col items-center rounded-lg bg-white shadow-xl`}
      >
        <img className="mx-2 w-24 phone:w-14" src={test} />
        <h1 className="my-2 w-20 rounded bg-[#ff850e] text-center font-bold text-white phone:w-14 phone:text-[12px]">
          快速測試
        </h1>
      </div>
    </div>
  );
}

export default Test;
