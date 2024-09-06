"use client";

import { myMutationOption } from "../page";
import { MutationBoundary } from "@xionwcfm/react-query";

export default function Page() {
  return (
    <MutationBoundary
      {...myMutationOption()}
      caseBy={{ success: (props) => <div>success</div>, error: <div>error</div>, pending: <div>pending</div> }}
    >
      <div>default state</div>
    </MutationBoundary>
  );
}
