import { default as React } from "react";
import noItem from "./noItem.png";

function NoItem({ content, distance, pictureWidth, textSize }) {
  return (
    <div
      className={`m-4 flex w-[${distance}] items-center justify-center rounded-2xl border-2 border-solid border-gray-200`}
    >
      <div className={`${pictureWidth}`}>
        <img src={noItem} />
      </div>
      <h1 className={`text-${textSize} font-bold text-gray-600`}>{content}</h1>
    </div>
  );
}

export default NoItem;
