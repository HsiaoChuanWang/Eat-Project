import { useNavigate } from "react-router-dom";
import logo from "./fakelogo.svg";

function Header() {
  const navigate = useNavigate();
  const buttonLogOut = [
    { link: "login", displayText: "登入" },
    { link: "signup", displayText: "註冊" },
  ];
  const buttonDiner = [
    { link: "diner", displayText: "食客專區" },
    { link: "", displayText: "登出" },
  ];
  const buttonBoss = [
    { link: "boss", displayText: "業者專區" },
    { link: "", displayText: "登出" },
  ];

  const renderSwitch = (situation) => {
    switch (situation) {
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
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
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
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
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
      <div>
        <img src={logo} className="m-8 h-20 w-auto" />
      </div>

      <div className="m-16">{renderSwitch("LogOut")}</div>
    </div>
  );
}

export default Header;
