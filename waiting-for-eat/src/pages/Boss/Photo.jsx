import { Button, ScrollShadow } from "@nextui-org/react";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Photo() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const detailInfo = useUserStore((state) => state.detailInfo);
  const companyInfo = useUserStore((state) => state.companyInfo);
  const companyRef = doc(db, "company", companyId);
  const [position, setPosition] = useState(0);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const companySnap = onSnapshot(doc(db, "company", companyId), (result) => {
      const data = result.data();
      setCompanyData(data);
    });

    return companySnap;
  }, []);

  const mainPicture = companyData.picture ? (
    <img className="w-96" src={companyData.picture} />
  ) : (
    <div>尚無上傳照片</div>
  );

  const menus = companyData.menu ? (
    companyData.menu.map((picture, index) => {
      return <img className="w-36" src={picture} key={index} />;
    })
  ) : (
    <div>尚無上傳照片</div>
  );

  return (
    <div className="relative my-16 flex justify-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className=" h-5/6 w-5/6">
          <div>
            <h1 className="text-2xl font-bold">封面照片</h1>
            <div className="w-[700px] border-t-2 border-solid border-gray-300 pb-4"></div>
            <div>{mainPicture}</div>

            <h1 className="mt-6 text-2xl font-bold">菜單照片</h1>

            <div className="w-[700px] border-t-2 border-solid border-gray-300 pb-6">
              <ScrollShadow orientation="horizontal" className="w-[700px]">
                <div className=" flex w-[1000px] p-4">
                  {companyData.menu ? (
                    companyData.menu.map((picture, index) => (
                      <div className="min-w-[200px]" key={index}>
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
                    <h4>暫無上傳菜單</h4>
                  )}
                </div>
              </ScrollShadow>
            </div>

            {/* <div className={`${display === false && "hidden"}`}>
              <Menu
                images={companyData.menu}
                position={position}
                setDisplay={setDisplay}
              />
            </div> */}
          </div>

          <Button
            radius="full"
            className="absolute bottom-2 right-16 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
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
