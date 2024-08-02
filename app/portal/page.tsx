import { Portal } from "~/src/portal";
import { PORTAL_ID } from "~/src/portal-id";

export default function Page() {
  return (
    <div>
      <Portal id={PORTAL_ID.CTA}>
        <div className=" fixed bottom-0 left-[50%] translate-x-[-50%] w-full max-w-[430px]">
          <button className=" w-full bg-purple-50">온클릭</button>
        </div>
      </Portal>
    </div>
  );
}
