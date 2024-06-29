import { renderHook } from "@testing-library/react";
import { useExtendedMutation } from "./builder";
import { wrapper } from "../test-utils/wrapper";

describe("", () => {
  const mockFn = vi.fn();
  const setup = () =>
    renderHook(() => useExtendedMutation({ mutationFn: () => mockFn.mockResolvedValue("hello")() }), {
      wrapper: wrapper(),
    });

  it("singleFlightTest", async () => {
    const { result } = setup();
    const { createMutation, isPendingRef } = result.current;
    const getter = createMutation().singleFlight().done();
    const value = await Promise.all([getter(), getter(), getter(), getter(), getter(), getter()]);
    expect(mockFn).toBeCalledTimes(1);
  });
});

describe("", () => {
  const mockFn = vi.fn();
  const setup = () =>
    renderHook(() => useExtendedMutation({ mutationFn: () => mockFn.mockResolvedValue("hello")() }), {
      wrapper: wrapper(),
    });
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("debounceTest", async () => {
    const { result } = setup();
    const { createMutation, isPendingRef } = result.current;
    const getter = createMutation().debounce({ ms: 100, trailing: true, leading: true }).done();
    await getter();
    vi.advanceTimersByTime(100);
    await getter();
    vi.advanceTimersByTime(100);

    expect(mockFn).toBeCalledTimes(2);
  });

  it("debounceTest2", async () => {
    const { result } = setup();
    const { createMutation, isPendingRef } = result.current;
    const getter = createMutation().debounce({ ms: 100, trailing: true, leading: true }).done();
    await getter();
    await getter();
    await getter();
    vi.advanceTimersByTime(100);
    await getter();
    vi.advanceTimersByTime(100);
    expect(mockFn).toBeCalledTimes(3);
  });

  it("intergration test", async () => {
    const { result } = setup();
    const { createMutation, isPendingRef } = result.current;
    const getter = createMutation().debounce({ ms: 100 }).singleFlight().done();
    const value = await Promise.all([getter(), getter(), getter(), getter(), getter(), getter()]);
    vi.advanceTimersByTime(100);
    expect(mockFn).toBeCalledTimes(1);
  });
});
