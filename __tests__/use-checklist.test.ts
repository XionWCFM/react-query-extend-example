import { act, renderHook } from "@testing-library/react";
import { computeCheckList, useCheckList } from "./use-checklist";

describe("computeCheckList 테스트", () => {
  type TestItem = { id: number | string; checked: boolean };

  it("TOGGLE_CHECK: 아이템의 체크 상태를 토글한다.", () => {
    const itemList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
      { id: 3, checked: false },
    ];
    const action = { type: "TOGGLE_CHECK" as const, target: 2 };

    const result = computeCheckList(itemList, action);
    expect(result).toEqual([
      { id: 1, checked: false },
      { id: 2, checked: false },
      { id: 3, checked: false },
    ]);
  });

  it("TOGGLE_CHECK: 존재하지 않는 아이템의 체크 상태를 토글하려 할 때 아무 변화가 없다.", () => {
    const itemList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
      { id: 3, checked: false },
    ];
    const action = { type: "TOGGLE_CHECK" as const, target: 4 };

    const result = computeCheckList(itemList, action);
    expect(result).toEqual(itemList);
  });

  it("CHECK_ALL: 모든 아이템의 체크 상태를 true로 설정한다.", () => {
    const itemList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
      { id: 3, checked: false },
    ];
    const action = { type: "CHECK_ALL" as const };

    const result = computeCheckList(itemList, action);
    expect(result).toEqual([
      { id: 1, checked: true },
      { id: 2, checked: true },
      { id: 3, checked: true },
    ]);
  });

  it("UNCHECK_ALL: 모든 아이템의 체크 상태를 false로 설정한다.", () => {
    const itemList: TestItem[] = [
      { id: 1, checked: true },
      { id: 2, checked: true },
      { id: 3, checked: true },
    ];
    const action = { type: "UNCHECK_ALL" as const };

    const result = computeCheckList(itemList, action);
    expect(result).toEqual([
      { id: 1, checked: false },
      { id: 2, checked: false },
      { id: 3, checked: false },
    ]);
  });

  it("EMPTY_ACTION: 유효하지 않은 액션 타입이 주어지면 원래 아이템 리스트를 반환한다.", () => {
    const itemList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
      { id: 3, checked: false },
    ];
    const action = { type: "INVALID_ACTION" as any };

    const result = computeCheckList(itemList, action);
    expect(result).toEqual(itemList);
  });

  it("빈 리스트에 대한 CHECK_ALL: 빈 리스트에 대해 CHECK_ALL 액션을 적용해도 빈 리스트가 반환된다.", () => {
    const itemList: TestItem[] = [];
    const action = { type: "CHECK_ALL" as const };

    const result = computeCheckList(itemList, action);
    expect(result).toEqual([]);
  });

  it("빈 리스트에 대한 UNCHECK_ALL: 빈 리스트에 대해 UNCHECK_ALL 액션을 적용해도 빈 리스트가 반환된다.", () => {
    const itemList: TestItem[] = [];
    const action = { type: "UNCHECK_ALL" as const };

    const result = computeCheckList(itemList, action);
    expect(result).toEqual([]);
  });
});

describe("useCheckList 테스트", () => {
  type TestItem = { id: number | string; checked: boolean };

  it("초기 리스트를 제대로 설정한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    expect(result.current.list).toEqual(initialList);
  });

  it("TOGGLE_CHECK: 아이템의 체크 상태를 토글한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: true },
      { id: 2, checked: true },
    ]);

    act(() => {
      result.current.toggle(2);
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: true },
      { id: 2, checked: false },
    ]);
  });

  it("CHECK_ALL: 모든 아이템의 체크 상태를 true로 설정한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: false },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    act(() => {
      result.current.checkAll();
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: true },
      { id: 2, checked: true },
    ]);
  });

  it("UNCHECK_ALL: 모든 아이템의 체크 상태를 false로 설정한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: true },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    act(() => {
      result.current.uncheckAll();
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: false },
      { id: 2, checked: false },
    ]);
  });

  it("isChecked: 특정 아이템의 체크 상태를 확인한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    expect(result.current.isChecked(1)).toBe(false);
    expect(result.current.isChecked(2)).toBe(true);
  });

  it("isAllChecked: 모든 아이템이 체크되었는지 확인한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: true },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    expect(result.current.isAllChecked()).toBe(true);

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.isAllChecked()).toBe(false);
  });

  it("findItem: 특정 아이템을 찾는다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    expect(result.current.findItem(1)).toEqual({ id: 1, checked: false });
    expect(result.current.findItem(3)).toBe(null);
  });

  it("findIndex: 특정 아이템의 인덱스를 찾는다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    expect(result.current.findIndex(1)).toBe(0);
    expect(result.current.findIndex(3)).toBe(null);
  });
  it("getCheckedIds: 체크된 아이템들의 id를 반환한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    expect(result.current.getCheckedIds()).toEqual([2]);
  });

  it("getCheckedList: 체크된 아이템들을 반환한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: true },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    expect(result.current.getCheckedList()).toEqual([{ id: 2, checked: true }]);
  });

  it("updateAll: 모든 아이템의 체크 상태를 업데이트한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: false },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    act(() => {
      result.current.updateAll(true);
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: true },
      { id: 2, checked: true },
    ]);

    act(() => {
      result.current.updateAll(false);
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: false },
      { id: 2, checked: false },
    ]);
  });

  it("toggleAll: 모든 아이템의 체크 상태를 토글한다.", () => {
    const initialList: TestItem[] = [
      { id: 1, checked: false },
      { id: 2, checked: false },
    ];

    const { result } = renderHook(() => useCheckList(initialList));

    act(() => {
      result.current.toggleAll();
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: true },
      { id: 2, checked: true },
    ]);

    act(() => {
      result.current.toggleAll();
    });

    expect(result.current.list).toEqual([
      { id: 1, checked: false },
      { id: 2, checked: false },
    ]);
  });
});
