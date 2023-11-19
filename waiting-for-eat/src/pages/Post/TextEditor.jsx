import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  function _uploadImageCallBack(file) {
    // long story short, every time we upload an image, we
    // need to save it to the state so we can get it's data
    // later when we decide what to do with it.

    // Make sure you have a uploadImages: [] as your default state
    // let uploadedImages = [this.state.uploadedImages];

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };

    // uploadedImages.push(imageObject);

    // this.setState(uploadedImages: uploadedImages)

    // We need to return a promise with the image src
    // the img src we will use here will be what's needed
    // to preview it in the browser. This will be different than what
    // we will see in the index.md file we generate.
    return new Promise((resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } });
    });
  }
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
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
            alignmentEnabled: true, // 是否显示排列按钮 相当于text-align
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
      <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  );
}

export default TextEditor;
