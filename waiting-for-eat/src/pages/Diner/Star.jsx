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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "../../firebase";
import useUserStore from "../../stores/userStore";

function Star({ companyId, orderId, userId, companyName }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [star, setStar] = useState(0);
  const [content, setContent] = useState("");
  const detailInfo = useUserStore((state) => state.detailInfo);

  async function handleSend() {
    const docRef = await addDoc(collection(db, "star"), {
      orderId: orderId,
      companyId: companyId,
      userId: userId,
      star: star,
      content: content,
      createTime: serverTimestamp(),
    });
  }

  return (
    <>
      <Button onPress={onOpen}>評論</Button>
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
                {companyName}
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
                    placeholder="請輸入評論內容"
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose} onClick={handleSend}>
                  張貼
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Star;
