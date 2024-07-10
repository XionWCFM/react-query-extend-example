"use client";

import { groupBy } from "es-toolkit";
import { ComponentPropsWithoutRef, forwardRef, Ref } from "react";
import { useCheckList } from "~/__tests__/use-checklist";

type AgreeTermsType = {
  id: string;
  checked: boolean;
  label: string;
  group: "required" | "optional";
};

const agreeTermsList = [
  {
    id: "1",
    checked: false,
    label: "이용약관동의",
    group: "required",
  },
  {
    id: "2",
    checked: false,
    label: "개인정보 수집 및 이용에 대한 안내",
    group: "required",
  },
  {
    id: "3",
    checked: false,
    label: "이벤트 등 프로모션 알림 메일 수신",
    group: "optional",
  },
] satisfies AgreeTermsType[];

export default function Page() {
  const check = useCheckList(agreeTermsList);
  const checkBoxGroup = groupBy(check.list, (item) => item.group);
  const isOptionalChecked = check.isCheckedBy(({ group }) => group === "optional");
  const isRequiredChecked = check.isCheckedBy(({ group }) => group === "required");
  const isAllChecked = check.isAllChecked();
  const handleChange = (type: AgreeTermsType["group"]) => {
    const checked = type === "required" ? isRequiredChecked : isOptionalChecked;
    check.checkBy(!checked, ({ group }) => group === type);
  };

  return (
    <div className=" px-4 py-2">
      {/* 모두 동의하기 */}
      <div className=" flex gap-x-4">
        <div className="">모두 동의하기</div>
        <CheckBox id="" checked={isAllChecked} onChange={check.toggleAll} />
      </div>

      <div className=" border w-full my-4"></div>

      {/* 필수 선택 렌더링하기 */}
      <div className=" flex mt-8 gap-x-4">
        <div className="">필수 선택만 모두 동의하기</div>
        <CheckBox id="필수선택모두동의" checked={isRequiredChecked} onChange={() => handleChange("required")} />
      </div>

      <div className=" mt-4 flex flex-col gap-y-4">
        {checkBoxGroup.required.map((checkBox) => (
          <div key={checkBox.id} className=" flex gap-x-4">
            <div>{checkBox.label}</div>
            <CheckBox id={checkBox.id} checked={checkBox.checked} onChange={() => check.toggle(checkBox.id)} />
          </div>
        ))}
      </div>

      <div className=" border w-full my-4"></div>

      {/* 옵셔널 선택 렌더링하기 */}
      <div className=" mt-8 flex gap-x-4">
        <div className=""> 선택 내용 모두 동의하기</div>
        <CheckBox
          id="선택모두동의"
          checked={check.isCheckedBy(({ group }) => group === "optional")}
          onChange={() => handleChange("optional")}
        />
      </div>

      <div className=" mt-4 flex flex-col gap-y-4">
        {checkBoxGroup.optional.map((checkBox) => (
          <div key={checkBox.id} className=" flex gap-x-4">
            <div>{checkBox.label}</div>
            <CheckBox id={checkBox.id} checked={checkBox.checked} onChange={() => check.toggle(checkBox.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

const CheckBox = forwardRef(function CheckBox(props: ComponentPropsWithoutRef<"input">, ref: Ref<HTMLInputElement>) {
  return <input {...props} ref={ref} type={"checkbox"} className="" />;
});
