import { useLoadScript } from "@react-google-maps/api";
import { Button, Form, Input, Radio, Select } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { storage } from "../../firebase";
import useUserStore from "../../stores/userStore";

function StepThreeBoss({ setActive }) {
  useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const userInfo = useUserStore((state) => state.userInfo);
  const getDetailInfo = useUserStore((state) => state.getDetailInfo);
  const sendUserFirestore = useUserStore((state) => state.sendUserFirestore);
  const getCompanyInfo = useUserStore((state) => state.getCompanyInfo);
  const sendCompanyFirestore = useUserStore(
    (state) => state.sendCompanyFirestore,
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

  const [company, setCompany] = useState({
    name: "",
    city: "",
    district: "",
    address: "",
    phone: "",
    category: "",
  });

  async function handlePicture(picture) {
    const storageRef = ref(storage, userInfo.userId);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setDetail({ ...detail, picture: downloadURL });
  }

  async function getLocation() {
    const location = company.city + company.district + company.address;
    const Geocoder = new window.google.maps.Geocoder();
    const GeocoderRequest = {
      address: location,
      region: "TW",
    };
    let lat;
    let lng;
    Geocoder.geocode(GeocoderRequest, (results, status) => {
      if (status === "OK" && results.length > 0) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        let obj = company;
        obj.lat = lat;
        obj.lng = lng;
        getCompanyInfo(company);
        sendCompanyFirestore();
      } else {
        console.log("error");
        console.log(`Geocode + ${status}`);
        alert("請確認地址已填寫且地址正確");
      }
    });
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

  const handleCompany = (e) => {
    let target = e.target.name;
    let value = e.target.value;
    switch (target) {
      case "name":
        setCompany({ ...company, name: value });
        break;
      case "city":
        setCompany({ ...company, city: value });
        break;
      case "district":
        setCompany({ ...company, district: value });
        break;
      case "address":
        setCompany({ ...company, address: value });
        break;
      case "telephone":
        setCompany({ ...company, phone: value });
        break;
    }
  };

  async function handleNext() {
    if (
      detail.userName != "" &&
      detail.gender != "" &&
      detail.phone != "" &&
      !Object.values(company).includes("")
    ) {
      checkRef.current = false;
      await getLocation();
      await getDetailInfo(detail);
      setActive("StepFour");
    } else {
      alert("請填寫完整資訊");
    }
  }

  return (
    <>
      <h2 className="p-6 text-center text-xl">負責人資訊</h2>
      <Form
        className="m-4"
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
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

        <h2 className="p-6 text-center text-xl">餐廳資訊</h2>

        <Form.Item
          label="餐廳名稱"
          name="name"
          rules={[
            {
              required: true,
              message: "請輸入餐廳名稱!",
            },
          ]}
        >
          <Input
            name="name"
            onChange={(e) => handleCompany(e)}
            value={company.name}
          />
        </Form.Item>

        <label className="font-[SimSun,sans-serif] text-[#ff4d4f]">* </label>
        <label className="inline-block">餐廳地址:</label>

        <Form.Item
          label="縣市"
          name="city"
          rules={[
            {
              required: true,
              message: "請輸入縣市!",
            },
          ]}
        >
          <Input
            className="w-20"
            name="city"
            onChange={(e) => handleCompany(e)}
            value={company.city}
            placeholder="台北市"
          />
        </Form.Item>

        <Form.Item
          label="鄉鎮市區"
          name="district"
          rules={[
            {
              required: true,
              message: "請輸入地區!",
            },
          ]}
        >
          <Input
            className="w-20"
            name="district"
            onChange={(e) => handleCompany(e)}
            value={company.district}
            placeholder="中山區"
          />
        </Form.Item>

        <Form.Item
          label="詳細地址"
          name="address"
          rules={[
            {
              required: true,
              message: "請輸入詳細地址!",
            },
          ]}
        >
          <Input
            name="address"
            onChange={(e) => handleCompany(e)}
            value={company.address}
            placeholder="南京西路12巷13弄9號"
          />
        </Form.Item>

        <Form.Item
          label="餐廳電話"
          name="telephone"
          rules={[
            {
              required: true,
              message: "請輸入餐廳電話!",
            },
          ]}
        >
          <Input
            name="telephone"
            onChange={(e) => handleCompany(e)}
            value={company.phone}
            placeholder="02-2556-5354"
          />
        </Form.Item>

        <Form.Item
          label="餐廳類別"
          name="category"
          rules={[
            {
              required: true,
              message: "請點選類別",
            },
          ]}
        >
          <Select
            name="category"
            onChange={(e) => setCompany({ ...company, category: e })}
            value={company.category}
            showSearch
            style={{
              width: 200,
            }}
            placeholder="點選類別"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            // filterSort={(optionA, optionB) =>
            //   (optionA?.label ?? "")
            //     .toLowerCase()
            //     .localeCompare((optionB?.label ?? "").toLowerCase())
            // }
            options={[
              {
                value: "0",
                label: "火鍋",
              },
              {
                value: "1",
                label: "燒烤",
              },
              {
                value: "2",
                label: "牛排",
              },
              {
                value: "3",
                label: "甜點",
              },
              {
                value: "4",
                label: "小吃",
              },
              {
                value: "5",
                label: "早餐",
              },
            ]}
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

export default StepThreeBoss;
