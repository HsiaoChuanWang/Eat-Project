import { Button, ScrollShadow } from "@nextui-org/react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import htmlToDraft from "html-to-draftjs";
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

function ActivityEdit() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [mainPicture, setMainPicture] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const { postId } = useParams();
  const uuid = uuidv4();

  function onEditorStateChange(e) {
    setEditorState(e);
  }

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

  useEffect(() => {
    const companySnap = onSnapshot(doc(db, "company", companyId), (doc) => {
      const data = doc.data();
      setCompanyData(data);
      const blocksFromHtml = htmlToDraft(data.description);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap,
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    });

    return companySnap;
  }, []);

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

  //送出html到firestore
  async function handleSend(postId) {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    const companyRef = doc(db, "company", companyId);
    await updateDoc(companyRef, {
      description: uploadHtml,
    });
  }

  return (
    <div className="relative p-20">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className="h-[1040px] border-2 border-solid border-black p-4">
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
      </ScrollShadow>

      <Button
        className="absolute bottom-24 right-16 mt-6 block h-11 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg "
        onClick={() => {
          navigate(`/boss/activity/${companyId}`);
        }}
      >
        取消
      </Button>

      <Button
        className="absolute bottom-40 right-16 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
        onClick={() => {
          handleSend();
          navigate(`/boss/activity/${companyId}`);
        }}
      >
        保存
      </Button>
    </div>
  );
}

export default ActivityEdit;
