import { Suspense } from "react";
import { BasicFunnel } from "~/src/examp/funnel";

export default function Page() {
  return (
    <div>
      <Suspense>
        <BasicFunnel />
      </Suspense>
    </div>
  );
}
