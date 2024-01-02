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
    <>
      <div
        className={`${
          (isTestShowed === false || loginStatus !== "LogOut") && "hidden"
        } fixed bottom-0 flex h-[calc(100%-96px)] w-full items-center justify-center bg-black/40`}
      >
        <div className="laptop:w-96 tablet:w-72 phone:w-72 tablet:h-80 phone:h-80 ml-8 flex h-[430px] w-[600px] flex-col items-center justify-between rounded-2xl bg-white">
          <div className="w-full">
            <div className="w-full rounded-t-2xl bg-[#ff850e] py-4 text-center font-bold ">
              <h1 className="laptop:text-lg text-2xl text-white ">
                想快速測試所有功能?
              </h1>
            </div>

            <div className="mt-4 flex items-center justify-center font-bold">
              <TiArrowSortedDown className="mr-1 animate-bounce text-xl" />
              <h2 className="laptop:text-sm text-base text-black">
                點擊下方選項，快速登入測試!
              </h2>
            </div>
          </div>

          <Link
            to="/login"
            onClick={testDiner}
            className="laptop:w-72 tablet:w-44 phone:w-44 tablet:h-20 phone:h-20 flex w-96 cursor-pointer items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-300"
          >
            <img
              className="laptop:w-36 tablet:hidden phone:hidden w-40"
              src={diner}
            />
            <h3 className="laptop:text-base tablet:text-sm w-36 text-xl font-bold">
              體驗"食客"
            </h3>
          </Link>

          <Link
            to="/login"
            onClick={testBoss}
            className="laptop:w-72 tablet:w-44 phone:w-44 tablet:h-20 phone:h-20 tablet:mb-4 phone:mb-4 mb-8 flex w-96 cursor-pointer items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-300"
          >
            <img
              className="laptop:w-36 tablet:hidden phone:hidden w-44"
              src={boss}
            />
            <h3 className="laptop:text-base w-36 text-xl font-bold">
              體驗"餐廳業者"
            </h3>
          </Link>
        </div>

        <CgCloseO
          onClick={showTest}
          className="laptop:mb-[500px] tablet:mb-[400px] phone:mb-[400px] mb-[500px] cursor-pointer text-3xl text-white"
        />
      </div>

      <div
        onClick={showTest}
        className={`${
          (isTestShowed === true || loginStatus !== "LogOut") && "hidden"
        } fixed bottom-8 left-8 flex cursor-pointer flex-col items-center rounded-lg bg-white shadow-xl`}
      >
        <img className="mx-2 w-24" src={test} />
        <h1 className="my-2 w-20 rounded bg-[#ff850e] text-center font-bold text-white">
          快速測試
        </h1>
      </div>
    </>
  );
}

export default Test;
