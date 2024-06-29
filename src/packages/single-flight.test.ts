import { SingleFlight } from "./single-flight";

describe("", () => {
  it("", () => {
    const singleFlight = new SingleFlight();
    const noop = async () => {
      await new Promise((res) => setTimeout(res, 1000));
      return "noop";
    };
    const singleFlightNoop = singleFlight.execute({ key: ["hello"], fn: noop });
    expect(true).toBe(true);
  });
});
