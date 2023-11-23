import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import db from "../../firebase";

//上傳照片，拿回URL
async function uploadPicture(picture) {
  const storage = getStorage();
  const storageRef = ref(storage, "666"); //666是傳上去的檔案名
  await uploadBytes(storageRef, picture); //picture是要上傳上去的img路徑
  const downloadURL = await getDownloadURL(storageRef); //downloadURL是回傳的url
  return { data: { link: downloadURL } };
}

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
  console.log(props);
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

//送出html到firestore
async function handleSend({ editorState }) {
  const uploadHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  console.log(uploadHtml);
  const postRef = doc(db, "post", "kR0VeTSdZfz0pLBAnF0y");
  await updateDoc(postRef, {
    content: uploadHtml,
    createdDate: serverTimestamp(),
  });
}

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  function _uploadImageCallBack(file) {
    const pictureURL = uploadPicture(file);
    return pictureURL;
  }

  return (
    <div>
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
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
            alt: { present: false, mandatory: false, previewImage: true },
            defaultSize: {
              height: "auto",
              width: "200px",
            },
          },
        }}
      />
      <button onClick={() => handleSend({ editorState })}>送出</button>
      {/* <textarea
        style={{ height: 400 + "px" }}
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      /> */}
    </div>
  );
}

export default TextEditor;
