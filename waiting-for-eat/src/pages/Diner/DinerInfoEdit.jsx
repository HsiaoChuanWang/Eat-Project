import { Button, Form, Input, Radio } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../firebase";
import useUserStore from "../../stores/userStore";

function DinerInfoEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const userInfo = useUserStore((state) => state.userInfo);
  const getDetailInfo = useUserStore((state) => state.getDetailInfo);
  const sendUserFirestore = useUserStore((state) => state.sendUserFirestore);

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
    const storageRef = ref(storage, userInfo.userId);
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

  async function handleNext() {
    if (detail.userName != "" && detail.gender != "" && detail.phone != "") {
      checkRef.current = false;
      await getDetailInfo(detail);
      await sendUserFirestore();
      setActive("StepFourDiner");
      navigate(`/diner/dinerInfo/${userId}`);
    } else {
      alert("請填寫完整資訊");
    }
  }

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <h2 className="p-6 text-center text-xl">基本資料</h2>
      <Form
        className="m-4"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="姓名"
          name="userName"
          rules={[
            {
              required: true,
              message: "請輸入姓名!",
            },
          ]}
        >
          <Input
            name="userName"
            onChange={(e) => handleData(e)}
            value={detail.userName}
          />
        </Form.Item>

        <Form.Item
          label="性別"
          name="gender"
          rules={[
            {
              required: true,
              message: "請點選性別!",
            },
          ]}
        >
          <Radio.Group
            name="gender"
            onChange={(e) => handleData(e)}
            value={detail.gender}
          >
            <Radio value="小姐">女</Radio>
            <Radio value="先生">男</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="手機"
          name="phone"
          rules={[
            {
              required: true,
              message: "請輸入手機!",
            },
          ]}
        >
          <Input
            name="phone"
            onChange={(e) => handleData(e)}
            value={detail.phone}
          />
        </Form.Item>

        <Form.Item
          label="上傳大頭照"
          name="picture"
          rules={[
            {
              required: false,
              message: "請輸入姓名!",
            },
          ]}
        >
          <Input
            type="file"
            accept="image/*"
            name="picture"
            onChange={(e) => handleData(e)}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            className="bg-[#1677ff]"
            onClick={handleNext}
            disabled={checkRef.current}
            type="primary"
            htmlType="button"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default DinerInfoEdit;
