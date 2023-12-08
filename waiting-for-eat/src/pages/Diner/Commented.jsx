import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { Rate } from "antd";
import dateFormat from "dateformat";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Commented() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [combineData, setCombineData] = useState([]);
  const [star, setStar] = useState("");
  const [content, setContent] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const starq = query(collection(db, "star"), where("userId", "==", userId));
  const detailInfo = useUserStore((state) => state.detailInfo);

  async function getCompanyInfo(companyId) {
    const docRef = doc(db, "company", companyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const resultUser = docSnap.data();
      return resultUser;
    } else {
      console.log("No such comment companyInfo document!");
    }
  }

  async function getOrderInfo(orderId) {
    const docRef = doc(db, "order", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const resultUser = docSnap.data();
      return resultUser;
    } else {
      console.log("No such comment companyInfo document!");
    }
  }

  useEffect(() => {
    const starSnap = onSnapshot(starq, (result) => {
      let starList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, starId: dataId };
        starList.push(combine);
      });

      let orderList = [];
      starList.forEach((item) => {
        getCompanyInfo(item.companyId).then((data) => {
          const newItem = Object.assign(item, data);
          getOrderInfo(newItem.orderId).then((data) => {
            const newnewItem = Object.assign(newItem, data);
            orderList.push(newnewItem);
            setCombineData([...orderList]);
          });
        });
      });
    });

    return starSnap;
  }, []);

  async function handleDelete(starId) {
    await deleteDoc(doc(db, "star", starId));
  }

  async function handleSend(starId) {
    const starRef = doc(db, "star", starId);
    await updateDoc(starRef, {
      star: star,
      content: content,
    });
  }

  const printDatas =
    combineData.length > 0 ? (
      combineData.map((data) => {
        return (
          <div
            key={data.starId}
            className="relative flex items-center border-2 border-solid border-black"
          >
            <div className="w-64">
              <img
                src={data.picture}
                onClick={() => {
                  navigate(`/restaurant/${data.companyId}`);
                }}
              />
            </div>
            <div className=" ml-4">
              <div className="flex">
                <p className="my-4  text-xl">用餐時間</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">{data.date}</p>
                <p className="my-4  ml-4 text-xl">{data.start}</p>
              </div>

              <div className="flex">
                <p className="my-4  text-xl">餐廳名稱</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">{data.name}</p>
              </div>

              <div className="flex">
                <Rate disabled defaultValue={data.star} />
              </div>

              <div className="flex">
                <p className="my-4  text-xl">撰寫時間</p>
                <p className="mx-4  my-4 text-xl">|</p>
                <p className="my-4  text-xl">
                  {dateFormat(data.createTime.toDate(), "yyyy/mm/dd HH:MM")}
                </p>
              </div>
            </div>

            <div className="absolute bottom-2 right-24">
              <Button onPress={onOpen}>編輯</Button>
              <Modal
                size="5xl"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        {data.name}
                      </ModalHeader>
                      <ModalBody>
                        <div className="w-full">
                          <User
                            name={detailInfo.userName}
                            avatarProps={{
                              src: detailInfo.picture,
                            }}
                          />

                          <Rate
                            allowHalf
                            className="block px-20 text-5xl"
                            onChange={(e) => {
                              setStar(e);
                            }}
                            value={star}
                          />
                          <Textarea
                            size="lg"
                            onChange={(e) => {
                              setContent(e.target.value);
                            }}
                            value={content}
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          取消
                        </Button>
                        <Button
                          color="primary"
                          onPress={onClose}
                          onClick={handleSend(data.starId)}
                        >
                          張貼
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>

            <button
              onClick={() => handleDelete(data.starId)}
              className="absolute bottom-2 right-8 h-8 border-2 border-solid border-black"
            >
              刪除
            </button>
          </div>
        );
      })
    ) : (
      <h1 key="no">未有相關資訊</h1>
    );

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">我的評論</h1>
      </div>
      <div>{printDatas}</div>
    </>
  );
}

export default Commented;
