"use client";
import { atom } from "jotai";
import { createSafeAtom } from "~/src/jotai/create-safe-atom";

type AuthType = {
  isLogin: boolean;
};

const [AuthContextProvider, authContext] = createSafeAtom(atom<AuthType>({ isLogin: false }));

type ExampleType = string;

const [ExampleContextProvider, exampleContext] = createSafeAtom(atom<ExampleType>(""));

const Component = () => {
  const [auth, setAuth] = authContext.useAtom();
  const authValue = authContext.useAtomValue();
  const dispatch = authContext.useSetAtom();

  return (
    <div>
      {auth.isLogin ? "로그인 되어있음" : "안되어있음"}
      <button onClick={() => setAuth((prev) => ({ isLogin: !prev.isLogin }))}>클릭하면 변경</button>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <AuthContextProvider>
        {/* Context 범위 안이기때문에 no error */}
        <Component />
        <ExampleContextProvider>
          <NestedComponent />
          <상관없음 />
        </ExampleContextProvider>
      </AuthContextProvider>
      {/* context 범위 바깥에서 사용했기 때문에 에러 */}
      {/* <Component /> */}
    </>
  );
}

const 상관없음 = () => {
  return <div>ㅗ디ㅣㅐ</div>;
};
const NestedComponent = () => {
  const auth = authContext.useAtomValue();

  return (
    <div>{auth.isLogin ? "Login : Context 내부에 있지만 접근 가능" : "Logout : Context 내부에 있지만 접근 가능"}</div>
  );
};
