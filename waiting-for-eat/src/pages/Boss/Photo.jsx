import { Button, ScrollShadow } from "@nextui-org/react";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import db from "../../firebase";
import noMenu from "../Restaurant/restaurantPictures/noMenu.png";
import boss from "../SignUp/signUpPictures/boss.png";

function Photo() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const companySnap = onSnapshot(doc(db, "company", companyId), (result) => {
      const data = result.data();
      setCompanyData(data);
      setIsLoading(false);
    });

    return companySnap;
  }, []);

  const mainPicture = companyData.picture ? (
    <img className="ml-6 w-80" src={companyData.picture} />
  ) : (
    <div className="mb-8 flex items-center">
      <img className="w-48" src={boss} />
      <h1 className="text-xl font-bold text-gray-600">尚未上傳封面照片</h1>
    </div>
  );

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="relative my-16 flex justify-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className=" h-5/6 w-5/6">
          <div className="ml-8">
            <h1 className="text-2xl font-bold">封面照片</h1>
            <div className="w-[700px] border-t-2 border-solid border-gray-300 pb-4"></div>
            <div>{mainPicture}</div>

            <h1 className="mt-6 text-2xl font-bold">菜單照片</h1>

            <div className="w-[700px] border-t-2 border-solid border-gray-300 pb-6">
              <ScrollShadow orientation="horizontal" className="w-[700px]">
                <div className=" flex w-[1000px] p-4">
                  {companyData.menu ? (
                    companyData.menu.map((picture, index) => (
                      <div className="w-[180px] min-w-[180px]" key={index}>
                        <img
                          className="cursor-pointer px-2"
                          src={picture}
                          onClick={() => {
                            setPosition(index);
                            setDisplay(true);
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center">
                      <img className="w-48" src={noMenu} />
                      <h1 className="text-xl font-bold text-gray-600">
                        尚無上傳菜單照片
                      </h1>
                    </div>
                  )}
                </div>
              </ScrollShadow>
            </div>
          </div>

          <Button
            radius="full"
            className="absolute bottom-2 right-24 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
            onClick={() => navigate(`/boss/photoUpload/${companyId}`)}
          >
            編輯
          </Button>
        </div>
      </ScrollShadow>
    </div>
  );
}

export default Photo;
