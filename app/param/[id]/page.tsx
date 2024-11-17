"use client";

import { wrap } from "@suspensive/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIntParams } from "~/src/use-int-params";

type CreateNavigateRouterType = {
  push: (to: string) => void;
  replace: (to: string) => void;
};

const createNavigate = (useInjectRouter: () => CreateNavigateRouterType) => {
  return function Navigate(props: { to: string; replace?: boolean }) {
    const { to, replace } = props;
    const router = useInjectRouter();

    useEffect(() => {
      if (replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }, [router, to, replace]);

    return null;
  };
};

const Navigate = createNavigate(() => useRouter());
export default wrap.ErrorBoundary({ fallback: <Navigate to="/" /> }).on(function Page() {
  const params = useIntParams<"id">();
  console.log(params.id, typeof params.id);
  return (
    <div>
      <div className="">{params.id}</div>
    </div>
  );
});
