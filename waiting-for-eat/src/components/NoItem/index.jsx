import { default as React } from "react";
import noItem from "./noItem.png";

function NoItem({ content, distance, pictureWidth, textSize }) {
  return (
    <div
      className={`m-4 flex ${distance} h-32 items-center justify-center rounded-2xl border-2 border-solid border-gray-200 bg-white`}
    >
      <div className={`${pictureWidth}`}>
        <img src={noItem} />
      </div>
      <h1 className={`${textSize} font-bold text-gray-600`}>{content}</h1>
    </div>
  );
}

export default NoItem;
