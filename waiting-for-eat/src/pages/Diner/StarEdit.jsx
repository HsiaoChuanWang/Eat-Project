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
import React from "react";
import useUserStore from "../../stores/userStore";

function StarEdit({ star, content, setStar, setContent, data }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const detailInfo = useUserStore((state) => state.detailInfo);

  return (
    <>
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
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  // onClick={handleSend}
                >
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

export default StarEdit;
