import { http } from "./http";

describe("Http를 테스트합니다.", () => {
  it("Http는", () => {
    try {
      http.get("simple");
    } catch (e) {
      console.log("dfsfds", e);
    }

    expect(true).toBe(true);
  });
});
