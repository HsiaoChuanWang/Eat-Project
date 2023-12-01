import { Rate, Space } from "antd";
import React, { useState } from "react";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

function StarRating() {
  const [value, setValue] = useState(3);

  return (
    <>
      <Space>
        <Rate tooltips={desc} onChange={setValue} value={value} />
        {value ? <span>{desc[value - 1]}</span> : ""}
      </Space>
    </>
  );
}

export default StarRating;
