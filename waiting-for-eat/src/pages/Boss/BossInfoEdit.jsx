import { useLoadScript } from "@react-google-maps/api";
import { Button, Form, Input, Radio, Select } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db, { storage } from "../../firebase";
import useUserStore from "../../stores/userStore";

function BossInfoEdit() {
  useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const { companyId } = useParams();
  const navigate = useNavigate();
  const userInfo = useUserStore((state) => state.userInfo);
  const detailInfo = useUserStore((state) => state.detailInfo);
  const [updateUser, setUpdateUser] = useState({
    userName: detailInfo.userName,
    gender: detailInfo.gender,
    phone: detailInfo.phone,
  });

  const companyInfo = useUserStore((state) => state.companyInfo);
  const [updateCompany, setUpdateCompany] = useState({
    name: companyInfo.name,
    city: companyInfo.city,
    district: companyInfo.district,
    address: companyInfo.address,
    phone: companyInfo.phone,
    category: companyInfo.category,
  });

  //user
  async function handlePicture(picture) {
    const storageRef = ref(storage, userInfo.userId);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setUpdateUser({ ...updateUser, picture: downloadURL });
  }

  async function handleUserUpdate() {
    const userRef = doc(db, "user", userInfo.userId);
    await updateDoc(userRef, updateUser);
    navigate(`/boss/bossInfo/${companyId}`);
  }

  //company
  async function getLocation() {
    const location =
      updateCompany.city + updateCompany.district + updateCompany.address;
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
        let obj = updateCompany;
        obj.lat = lat;
        obj.lng = lng;
      } else {
        console.log("error");
        console.log(`Geocode + ${status}`);
        alert("請確認地址已填寫且地址正確");
      }
    });
  }

  async function handleCompanyUpdate() {
    await getLocation();
    const companyRef = doc(db, "company", companyId);
    await updateDoc(companyRef, updateCompany);
    navigate(`/boss/bossInfo/${companyId}`);
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
        <Form.Item label="姓名">
          <Input
            name="userName"
            onChange={(e) =>
              setUpdateUser({
                ...updateUser,
                userName: e.target.value,
              })
            }
            value={updateUser.userName}
          />
        </Form.Item>

        <Form.Item label="性別">
          <Radio.Group
            name="gender"
            onChange={(e) =>
              setUpdateUser({
                ...updateUser,
                gender: e.target.value,
              })
            }
            value={updateUser.gender}
          >
            <Radio value="小姐">女</Radio>
            <Radio value="先生">男</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="手機">
          <Input
            name="phone"
            onChange={(e) =>
              setUpdateUser({
                ...updateUser,
                phone: e.target.value,
              })
            }
            value={updateUser.phone}
          />
        </Form.Item>

        <Form.Item label="上傳大頭照" name="picture">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handlePicture(e)}
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
            onClick={handleUserUpdate}
            type="primary"
            htmlType="button"
          >
            Submit
          </Button>
        </Form.Item>

        <h2 className="p-6 text-center text-xl">餐廳資訊</h2>

        <Form.Item label="餐廳名稱">
          <Input
            name="name"
            onChange={(e) =>
              setUpdateCompany({ ...updateCompany, name: e.target.value })
            }
            value={updateCompany.name}
          />
        </Form.Item>

        <label className="font-[SimSun,sans-serif] text-[#ff4d4f]">* </label>
        <label className="inline-block">餐廳地址:</label>

        <Form.Item label="縣市">
          <Input
            className="w-20"
            name="city"
            onChange={(e) =>
              setUpdateCompany({ ...updateCompany, city: e.target.value })
            }
            value={updateCompany.city}
          />
        </Form.Item>

        <Form.Item label="鄉鎮市區">
          <Input
            className="w-20"
            name="district"
            onChange={(e) =>
              setUpdateCompany({ ...updateCompany, district: e.target.value })
            }
            value={updateCompany.district}
          />
        </Form.Item>

        <Form.Item label="詳細地址">
          <Input
            name="address"
            onChange={(e) =>
              setUpdateCompany({ ...updateCompany, address: e.target.value })
            }
            value={updateCompany.address}
          />
        </Form.Item>

        <Form.Item label="餐廳電話">
          <Input
            name="telephone"
            onChange={(e) =>
              setUpdateCompany({ ...updateCompany, phone: e.target.value })
            }
            value={updateCompany.phone}
          />
        </Form.Item>

        <Form.Item label="餐廳類別">
          <Select
            name="category"
            onChange={(e) =>
              setUpdateCompany({ ...updateCompany, category: e })
            }
            value={updateCompany.category}
            showSearch
            style={{
              width: 200,
            }}
            placeholder="點選類別"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
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
            onClick={handleCompanyUpdate}
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

export default BossInfoEdit;
