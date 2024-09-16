"use client";
import { useFunnel, createFunnelSteps } from "@use-funnel/browser";
//dsa
export default function Page() {
  const funnel = useFunnel<{
    이메일입력: 이메일입력;
    비밀번호입력: 비밀번호입력;
    그외정보입력: 그외정보입력;
  }>({ id: "my-funnel", initial: { step: "이메일입력", context: {} } });

  return (
    <div className="">
      <funnel.Render
        이메일입력={({ history }) => (
          <div>
            <button onClick={() => history.push("비밀번호입력", { email: "비밀번호입력에 전달" })}>클릭</button>
          </div>
        )}
        비밀번호입력={({ history, context }) => (
          <div>
            {context.email}
            <button onClick={() => history.push("그외정보입력", { email: "123", password: "123" })}>클릭</button>
          </div>
        )}
        그외정보입력={({ history }) => (
          <div>
            <button onClick={() => history.push("이메일입력", { email: "123" })}>클릭</button>
          </div>
        )}
      />
    </div>
  );
}
type 이메일입력 = { email?: string; password?: string; other?: unknown };
type 비밀번호입력 = { email: string; password?: string; other?: unknown };
type 그외정보입력 = { email: string; password: string; other?: unknown };
