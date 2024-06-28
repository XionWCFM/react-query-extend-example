import { act, renderHook, waitFor } from "@testing-library/react";
import { useExtendedMutation } from "./use-mutation-with-ref";
import { wrapper } from "../test-utils/wrapper";
import { setupWithUser } from "../test-utils/setup-with-user";
import { screen } from "@testing-library/react";

describe("use-mutation-with-ref를 테스트합니다.", () => {
  const mockFn = vi.fn();

  const setup = () => renderHook(() => useExtendedMutation({ mutationFn: () => mockFn() }), { wrapper: wrapper() });
  it("단기간에 많이 호출되더라도 단 한번만 호출됩니다.", () => {
    const { result } = setup();
    const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const handleClick = () => {
      if (result.current.isPendingRef.current) return;
      result.current.mutateAsync();
    };
    act(() => {
      list.forEach(handleClick);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it("뮤테이션 요청이 종료된 뒤 요청을 보내는 것은 가능합니다.", async () => {
    const { result } = setup();
    const handleClick = () => {
      if (result.current.isPendingRef.current) return;
      result.current.mutateAsync();
    };

    act(() => {
      handleClick();
    });

    expect(mockFn).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(result.current.isPendingRef.current).toBe(false));

    act(() => {
      handleClick();
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
  it("singleFlight 요청을 테스트합니다.", async () => {
    const { result } = setup();
    const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const handleClick = () => {
      if (result.current.isPendingRef.current) return;
      result.current.mutateAsyncSingleFlight();
    };
    act(() => {
      list.forEach(handleClick);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
