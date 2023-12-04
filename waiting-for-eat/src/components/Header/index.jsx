import { getAuth, signOut } from "firebase/auth";
// import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useHeaderStore from "../../stores/headerStore";
import useUserStore from "../../stores/userStore";
import logo from "./fakelogo.svg";

function Header() {
  const navigate = useNavigate();
  const setIsLogout = useUserStore((state) => state.setIsLogout);
  const userInfo = useUserStore((state) => state.userInfo);
  const situation = useHeaderStore((state) => state.situation);
  const setHeader = useHeaderStore((state) => state.setHeader);
  const auth = getAuth();

  //   useEffect(() => {
  //     if (userInfo.userId != "") {

  //     }
  //   }, [userInfo.userId]);

  function logOut() {
    signOut(auth)
      .then(() => {
        setIsLogout();
        alert("已登出");
        console.log("LoginOut successfully!");
      })
      .catch((error) => {
        console.log("LoginOut failed!", "=", error);
      });
  }

  const buttonSignUp = [
    { link: "", displayText: "回到首頁", status: "LogOut" },
  ];

  const buttonLogOut = [
    { link: "login", displayText: "登入", status: "SignUp" },
    { link: "signup", displayText: "註冊", status: "SignUp" },
  ];

  const buttonDiner = [
    {
      link: `diner/${userInfo.userId}`,
      displayText: "食客專區",
      status: "DinerLogIn",
    },
    { link: "", displayText: "登出", status: "LogOut" },
  ];

  const buttonBoss = [
    { link: "boss", displayText: "業者專區", status: "BossLogIn" },
    { link: "", displayText: "登出", status: "LogOut" },
  ];

  const renderSwitch = () => {
    switch (situation) {
      case "SignUp":
        return buttonSignUp.map((item) => (
          <button
            key={item.displayText}
            className="m-2.5 rounded-sm border-2 border-solid border-black text-lg"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              console.log(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </button>
        ));

      case "LogOut":
        return buttonLogOut.map((item) => (
          <button
            key={item.displayText}
            className="m-2.5 rounded-sm border-2 border-solid border-black text-lg"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              console.log(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </button>
        ));
      case "DinerLogIn":
        return buttonDiner.map((item) => (
          <button
            key={item.displayText}
            className="m-2.5 rounded-sm border-2 border-solid border-black text-lg"
            onClick={() => {
              if (item.displayText === "登出") {
                logOut();
              }
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              console.log(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </button>
        ));
      case "BossLogIn":
        return buttonBoss.map((item) => (
          <button
            key={item.displayText}
            className="m-2.5 rounded-sm border-2 border-solid border-black text-lg"
            onClick={() => {
              if (item.displayText === "登出") {
                logOut();
              }
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              console.log(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </button>
        ));
    }
  };

  return (
    <div className="flex h-24 items-center justify-between shadow-[0_0_2px_1px_rgba(0,0,0,0.16)]">
      <Link to="/">
        <img src={logo} className="m-8 h-20 w-auto" />
      </Link>

      <div className="m-16">{renderSwitch("LogOut")}</div>
    </div>
  );
}

export default Header;
