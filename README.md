# A Cascade Selector Class

sometimes we need to make a multiple cascade selector, as follow:
<img width="529" alt="image" src="https://user-images.githubusercontent.com/76041600/233778032-245bdc6c-37da-488c-a73b-777416c8b2ee.png">

this util may be useful to you to create it. look at the example:
```typescript
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
```
then you can create a instace named 'multiCascader':
```typescript
import { createMultiCascader, Option } from "./cascade";
const multiCascader = createMultiCascader(option, []);
```
you can use it in a framework such as React:
```tsx
export default function ClazzInfo(prop: {
  clazzOption: Option<string>
  clazzIDs: string[]
  changeClazzID: (ids: string[]) => void
}) {
  const { clazzOption, clazzIDs, changeClazzID } = prop

  const multiCascader = useMemo(() => createMultiCascader(clazzOption, clazzIDs), [])

  return (
    <div className="clazz-box">
      <Checkbox
        checked={multiCascader.checked}
        onChange={(checked) => {
          multiCascader.checked = checked
          changeClazzID(multiCascader.checkedLeaves.map((l) => l.value))
        }}
      >
        全部
      </Checkbox>

      {multiCascader.children.map((grade, index) => (
        <div key={index} className="grade">
          <div className="top">
            <div className="name">{grade.label}</div>
            <Checkbox
              checked={grade.checked}
              onChange={(checked) => {
                grade.checked = checked
                changeClazzID(multiCascader.checkedLeaves.map((l) => l.value))
              }}
            >
              班级全选
            </Checkbox>
          </div>
          {grade.children.map((clazz, index) => (
            <div className="clazz" key={index}>
              <Checkbox
                checked={clazz.checked}
                onChange={(checked) => {
                  clazz.checked = checked
                  changeClazzID(multiCascader.checkedLeaves.map((l) => l.value))
                }}
              >
                {clazz.label}
              </Checkbox>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```
as above, you may just need to provide the 'multiCascader.checkedLeaves' to the callback function, all the work has done in 'multiCascader'. it works well:

<img width="340" alt="image" src="https://user-images.githubusercontent.com/76041600/233779120-294e36e6-7249-4922-9719-325e41a55751.png">

more details: 
https://zhuanlan.zhihu.com/p/590854136
