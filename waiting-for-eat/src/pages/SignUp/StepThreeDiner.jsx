import { Form, Input, Radio } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Bs3CircleFill } from "react-icons/bs";
import Alert from "../../components/Alert/index.jsx";
import { storage } from "../../firebase";
import useUserStore from "../../stores/userStore.js";
import stepThree from "./signUpPictures/stepThree.jpg";

function StepThreeDiner({ setActive }) {
  const userId = useUserStore((state) => state.userId);
  const setDetailInfo = useUserStore((state) => state.setDetailInfo);
  const sendUserInfoToFirestore = useUserStore(
    (state) => state.sendUserInfoToFirestore,
  );

  const checkRef = useRef(false);

  const [detail, setDetail] = useState({
    userName: "",
    address: "",
    companyId: "",
    gender: "",
    phone: "",
    picture: "",
    status: "active",
  });

  async function handlePicture(picture) {
    const storageRef = ref(storage, userId);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setDetail({ ...detail, picture: downloadURL });
  }

  const handleData = (e) => {
    let target = e.target.name;
    let value = e.target.value;

    switch (target) {
      case "userName":
        setDetail({ ...detail, userName: value });
        break;
      case "gender":
        setDetail({ ...detail, gender: value });
        break;
      case "phone":
        setDetail({ ...detail, phone: value });
        break;
      case "picture":
        handlePicture(e.target.files[0]);
        break;
    }
  };

  async function nextStep() {
    if (detail.userName != "" && detail.gender != "" && detail.phone != "") {
      checkRef.current = false;
      await setDetailInfo(detail);
      await sendUserInfoToFirestore();
      setActive("StepFourDiner");
    } else {
      toast.error("請填寫完整資訊");
    }
  }

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <Alert />
      <img
        src={stepThree}
        className="h-full w-3/5 object-cover object-center"
      />

      <div className="flex h-full w-2/5 flex-col items-center justify-center">
        <div
          className={`flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl bg-white`}
        >
          <div className=" mb-8 flex items-center gap-2 text-3xl font-black text-[#ff850e]">
            <Bs3CircleFill />
            <h1>填寫基本資訊</h1>
          </div>

          <Form autoComplete="off" className="mb-8">
            <div className="flex items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                姓名
              </h1>
              <Input
                className="h-8 w-28"
                name="userName"
                onChange={(e) => handleData(e)}
                value={detail.userName}
              />
            </div>

            <div className="flex items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                性別
              </h1>

              <Radio.Group
                name="gender"
                onChange={(e) => handleData(e)}
                value={detail.gender}
              >
                <Radio value="小姐">女</Radio>
                <Radio value="先生">男</Radio>
              </Radio.Group>
            </div>

            <div className="flex items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                手機
              </h1>
              <Input
                className="h-8 w-64"
                name="phone"
                onChange={(e) => handleData(e)}
                value={detail.phone}
                placeholder="0911-654-987"
              />
            </div>

            <div className="mb-4 flex  items-center">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                上傳大頭照
              </h1>
              <Input
                className="h-8 w-64 text-xs"
                type="file"
                accept="image/*"
                name="picture"
                onChange={(e) => handleData(e)}
              />
            </div>
          </Form>

          <button
            className="mr-8 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
            onClick={nextStep}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepThreeDiner;
