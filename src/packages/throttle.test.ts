import { describe, it, expect, vi } from "vitest";
import { throttle } from "./throttle";

// throttle 함수 테스트
describe("throttle", () => {
  // 기본 테스트 설정
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // 테스트 종료 후 설정 초기화
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it("함수가 주어진 시간 내에 여러 번 호출되지 않도록 하는지 테스트", () => {
    // mock 함수 생성
    const func = vi.fn();
    // 3초의 쓰로틀링 시간 설정
    const throttledFunc = throttle(func, 3000);

    // 함수 첫 호출
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    // 2초 후에 함수 재호출
    vi.advanceTimersByTime(2000);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1); // 두 번째 호출은 무시됨

    // 추가 2초 후에 함수 재호출
    vi.advanceTimersByTime(2000);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(2); // 세 번째 호출은 성공
  });

  it("reset 함수가 쓰로틀링을 초기화하는지 테스트", () => {
    // mock 함수 생성
    const func = vi.fn();
    // 3초의 쓰로틀링 시간 설정
    const throttledFunc = throttle(func, 3000);

    // 함수 첫 호출
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    // 1초 후에 reset 호출
    vi.advanceTimersByTime(1000);
    throttledFunc.reset();

    // reset 후 바로 함수 재호출
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(2); // 두 번째 호출은 성공

    // 추가 3초 후에 함수 재호출
    vi.advanceTimersByTime(3000);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(3); // 세 번째 호출은 성공
  });
});
