import { Card, ScrollShadow } from "@nextui-org/react";
import { useLoadScript } from "@react-google-maps/api";
import { Button, Form, Input, Radio, Select } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import db, { storage } from "../../firebase";
import useUserStore from "../../stores/userStore.js";

function BossInfoEdit() {
  useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const { companyId } = useParams();
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
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
    const storageRef = ref(storage, userId);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setUpdateUser({ ...updateUser, picture: downloadURL });
  }

  async function handleUserUpdate() {
    const userRef = doc(db, "user", userId);
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
        const companyRef = doc(db, "company", companyId);
        updateDoc(companyRef, updateCompany);
        navigate(`/boss/bossInfo/${companyId}`);
      } else {
        console.log("error");
        console.log(`Geocode + ${status}`);
        toast.error("請確認地址已填寫且地址正確");
      }
    });
  }

  async function handleCompanyUpdate() {
    await getLocation();
    // const companyRef = doc(db, "company", companyId);
    // await updateDoc(companyRef, updateCompany);
    // navigate(`/boss/bossInfo/${companyId}`);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Alert />
      <Card className="w-2/3">
        <ScrollShadow
          size={0}
          hideScrollBar
          className=" h-[calc(100vh-300px)] w-full"
        >
          <div className="relative mt-8">
            <h2 className="mb-2 ml-20 text-2xl font-bold">負責人資訊</h2>
            <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
            <Form className="ml-20">
              <div className="flex items-center">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                  姓名
                </h1>
                <Input
                  className="h-8 w-28"
                  onChange={(e) =>
                    setUpdateUser({
                      ...updateUser,
                      userName: e.target.value,
                    })
                  }
                  value={updateUser.userName}
                />
              </div>

              <div className="flex items-center">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                  性別
                </h1>
                <Radio.Group
                  className="font-black"
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
              </div>

              <div className="flex items-center">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                  手機
                </h1>
                <Input
                  className="h-8 w-64"
                  name="phone"
                  onChange={(e) =>
                    setUpdateUser({
                      ...updateUser,
                      phone: e.target.value,
                    })
                  }
                  value={updateUser.phone}
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
                  onChange={(e) => handlePicture(e)}
                />
              </div>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  style={{ background: "#b0aba5", cursor: "pointer" }}
                  className="absolute bottom-0 right-36  font-bold"
                  onClick={() => navigate(`/boss/bossInfo/${companyId}`)}
                  type="primary"
                  htmlType="button"
                >
                  返回
                </Button>

                <Button
                  className="absolute bottom-0 right-16 font-bold"
                  onClick={handleUserUpdate}
                  type="primary"
                  htmlType="button"
                >
                  更新
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="relative">
            <h2 className="mb-2 ml-20 text-2xl font-bold">餐廳資訊</h2>
            <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
            <Form className="ml-20">
              <div className="flex items-center">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                  店名
                </h1>
                <Input
                  className="h-8 w-64"
                  name="name"
                  onChange={(e) =>
                    setUpdateCompany({ ...updateCompany, name: e.target.value })
                  }
                  value={updateCompany.name}
                />
              </div>

              <div className="flex items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                  地址
                </h1>

                <div className="mr-4">
                  <h2 className="text-xs text-gray-400">縣市</h2>
                  <Input
                    className="w-20"
                    name="city"
                    onChange={(e) =>
                      setUpdateCompany({
                        ...updateCompany,
                        city: e.target.value,
                      })
                    }
                    value={updateCompany.city}
                  />
                </div>

                <div className="mr-4">
                  <h2 className="text-xs text-gray-400">鄉鎮市區</h2>
                  <Input
                    className="w-20"
                    name="district"
                    onChange={(e) =>
                      setUpdateCompany({
                        ...updateCompany,
                        district: e.target.value,
                      })
                    }
                    value={updateCompany.district}
                  />
                </div>

                <div>
                  <h2 className="text-xs text-gray-400">詳細地址</h2>

                  <Input
                    className="w-44"
                    name="address"
                    onChange={(e) =>
                      setUpdateCompany({
                        ...updateCompany,
                        address: e.target.value,
                      })
                    }
                    value={updateCompany.address}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                  餐廳電話
                </h1>
                <Input
                  className="h-8 w-64"
                  name="telephone"
                  onChange={(e) =>
                    setUpdateCompany({
                      ...updateCompany,
                      phone: e.target.value,
                    })
                  }
                  value={updateCompany.phone}
                />
              </div>

              <div className="flex items-center">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify]">
                  類別
                </h1>
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
              </div>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  style={{ background: "#b0aba5", cursor: "pointer" }}
                  className="absolute bottom-0 right-36  font-bold"
                  onClick={() => navigate(`/boss/bossInfo/${companyId}`)}
                  type="primary"
                  htmlType="button"
                >
                  返回
                </Button>

                <Button
                  className="absolute bottom-0 right-16 font-bold"
                  onClick={handleCompanyUpdate}
                  type="primary"
                  htmlType="button"
                >
                  更新
                </Button>
              </Form.Item>
            </Form>
          </div>
        </ScrollShadow>
      </Card>
    </div>
  );
}

export default BossInfoEdit;
