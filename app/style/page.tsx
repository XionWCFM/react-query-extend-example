"use client";
import { useState } from "react";

const CALENDAR_BORDER_RADIUS_VARS = "--azito-calendar-border-radius";

const useCalendarBorderRadius = () => {
  const [calendarBorderRadius, setCalendarBorderRadius] = useState(0);
  const onVarsChange = (borderRadius: number) => {
    setCalendarBorderRadius(borderRadius);
    document.documentElement.style.setProperty(CALENDAR_BORDER_RADIUS_VARS, `${borderRadius}px`);
  };

  return { value: calendarBorderRadius, onChange: onVarsChange };
};

const Calendar = () => {
  console.log("rerender calendar");
  return (
    <div className={"bg-primary-100"} style={{ borderRadius: `var(${CALENDAR_BORDER_RADIUS_VARS})` }}>
      calendar
    </div>
  );
};

const Setting = () => {
  const radius = useCalendarBorderRadius();
  console.log("rerender setting");
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          radius.onChange(4);
        }}
      >
        4픽셀
      </button>
      <button type="button" onClick={() => radius.onChange(999)}>
        8픽셀
      </button>
    </div>
  );
};

export default function Page() {
  return (
    <div>
      <Calendar />
      <Setting />
    </div>
  );
}
