"use client";

import { Radio } from "@xionwcfm/xds";
import { useState } from "react";

export const Radios = () => {
  const [value, setValue] = useState("1");

  return (
    <Radio
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    >
      <Radio.Option value={"1"}>valud</Radio.Option>
      <Radio.Option value={"2"}>valu2</Radio.Option>
    </Radio>
  );
};
