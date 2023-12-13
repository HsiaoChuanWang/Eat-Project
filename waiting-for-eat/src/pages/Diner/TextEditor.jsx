import { Button } from "@nextui-org/react";
import { Form, Input } from "antd";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import db from "../../firebase";

//解決因為圖片死去的問題
function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();

  //將圖片類型轉換成mediaComponent
  if (type === "atomic") {
    return {
      component: Media,
      editable: false,
      props: {
        foo: "bar",
      },
    };
  }
}

function Media(props) {
  const { block, contentState } = props;
  const data = contentState.getEntity(block.getEntityAt(0)).getData();
  const emptyHtml = " ";
  return (
    <div>
      {emptyHtml}
      <img
        src={data.src}
        alt={data.alt || ""}
        style={{
          height: data.height || "auto",
          width: data.width || "auto",
        }}
      />
    </div>
  );
}

function TextEditor() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [mainPicture, setMainPicture] = useState("");
  const [orderData, setOrderData] = useState({});
  const uuid = uuidv4();

  useEffect(() => {
    const orderRef = doc(db, "order", orderId);
    getDoc(orderRef).then((result) => {
      const data = result.data();
      setOrderData(data);
    });
  }, []);

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  //上傳食記中照片，拿回URL
  async function uploadPicture(picture) {
    const storage = getStorage();
    const storageRef = ref(storage, uuid);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    return { data: { link: downloadURL } };
  }

  function _uploadImageCallBack(file) {
    const pictureURL = uploadPicture(file);
    return pictureURL;
  }

  //上傳main照片
  async function handleMainPicture(picture) {
    const storage = getStorage();
    const storageRef = ref(storage, uuid);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setMainPicture(downloadURL);
  }

  //送出html到firestore
  async function handleSend() {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    await addDoc(collection(db, "post"), {
      title: title,
      mainPicture: mainPicture,
      content: uploadHtml,
      createTime: serverTimestamp(),
      orderId: orderId,
      userId: orderData.userId,
      companyId: orderData.companyId,
    });
  }

  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full max-w-[1300px] px-20 pb-20 pt-12">
        <div>
          <Form>
            <Form.Item
              label="標題"
              rules={[
                {
                  message: "請輸入標題!",
                },
              ]}
            >
              <Input
                className="w-96"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </Form.Item>

            <Form.Item label="上傳封面照片" className="w-96">
              <Input
                type="file"
                accept="image/*"
                name="picture"
                onChange={(e) => handleMainPicture(e.target.files[0])}
              />
            </Form.Item>
          </Form>
        </div>

        <div className="min-h-[400px] border-2 border-solid border-black">
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
            customBlockRenderFunc={myBlockRenderer}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "textAlign",
                "history",
                "colorPicker",
                "emoji",
                "image",
                "remove",
              ],
              inline: {
                options: ["bold", "italic", "underline", "strikethrough"],
                bold: { className: "demo-option-custom" },
                italic: { className: "demo-option-custom" },
                underline: { className: "demo-option-custom" },
                strikethrough: { className: "demo-option-custom" },
                monospace: { className: "demo-option-custom" },
                superscript: { className: "demo-option-custom" },
                subscript: { className: "demo-option-custom" },
              },
              blockType: {
                options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
                className: "demo-option-custom-wide",
                dropdownClassName: "demo-dropdown-custom",
              },
              fontSize: { className: "demo-option-custom-medium" },
              image: {
                urlEnabled: true,
                uploadEnabled: true,
                alignmentEnabled: false, // 是否顯示圖片排列置中與否，相當於text-align
                uploadCallback: _uploadImageCallBack,
                previewImage: true,
                inputAccept:
                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                alt: { present: false, mandatory: false, previewImage: true },
                defaultSize: {
                  height: "auto",
                  width: "200px",
                },
              },
            }}
          />
        </div>

        <Button
          className="absolute bottom-4 right-48 mt-8 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg"
          onClick={() => {
            navigate(`/diner/posted/${orderData.userId}`);
          }}
        >
          返回
        </Button>

        <Button
          className="absolute bottom-4 right-20 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
          onClick={() => {
            handleSend().then(() => {
              navigate(`/diner/posted/${orderData.userId}`);
            });
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
}

export default TextEditor;
