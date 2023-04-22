import { createMultiCascader, Option } from "./cascade";

const option: Option<string> = {
  label: "全部",
  value: "-1",
  children: [
    {
      label: "一年级",
      value: "1",
      children: [
        { label: "一班", value: "1_1" },
        { label: "二班", value: "1_2" },
      ],
    },
    {
      label: "二年级",
      value: "2",
      children: [
        { label: "一班", value: "2_1" },
        { label: "二班", value: "2_2" },
      ],
    },
  ],
};

const cascader = createMultiCascader(option, []);
