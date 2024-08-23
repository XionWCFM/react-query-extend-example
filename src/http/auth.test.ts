import { auth } from "./auth";

describe("auth module (without ky)", () => {
  it("should add Bearer prefix correctly", () => {
    const token = "myAccessToken";
    const result = auth.addBearer(token);

    expect(result).toBe(`Bearer ${token}`);
  });

  it("should not add Bearer if already present", () => {
    const token = "Bearer myAccessToken";
    const result = auth.addBearer(token);

    expect(result).toBe(token);
  });

  it("should remove Bearer prefix correctly", () => {
    const tokenWithBearer = "Bearer myAccessToken";
    const result = auth.removeBearer(tokenWithBearer);

    expect(result).toBe("myAccessToken");
  });

  it("should return the original value if Bearer is not present", () => {
    const token = "myAccessToken";
    const result = auth.removeBearer(token);

    expect(result).toBe(token);
  });
});
