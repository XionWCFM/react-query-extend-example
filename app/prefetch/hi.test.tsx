import { render } from "@testing-library/react";
import { Provider1 } from "./page";

describe("Hi를 테스트합니다.", () => {
  it("Hi는", () => {
    render(
      <Provider1 value={{ message: "hello" }}>
        <div>hello</div>
      </Provider1>,
    );
  });
});
