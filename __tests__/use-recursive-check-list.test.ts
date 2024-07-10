import { act, renderHook } from "@testing-library/react";
import { RecursiveCheckList, useRecursiveCheckList } from "./use-recursive-check-list";

const sampleData: RecursiveCheckList[] = [
  {
    id: 1,
    checked: false,
    children: [
      {
        id: 2,
        checked: false,
        children: [
          { id: 3, checked: false },
          { id: 4, checked: false },
        ],
      },
      {
        id: 5,
        checked: false,
        children: [
          { id: 6, checked: false },
          { id: 7, checked: false },
        ],
      },
    ],
  },
];

describe("useRecursiveCheckList", () => {
  it("should toggle item check state", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggle(3);
    });

    const updatedItem = result.current.findItem(3);
    expect(updatedItem?.checked).toBe(true);
  });

  it("should update parent check state when all children are checked", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggle(3);
      result.current.toggle(4);
    });

    const parentItem = result.current.findItem(2);
    expect(parentItem?.checked).toBe(true);
  });

  it("should update parent check state when not all children are checked", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggle(3);
    });

    const parentItem = result.current.findItem(2);
    expect(parentItem?.checked).toBe(false);
  });

  it("should check all children when parent is checked", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.isChecked(3)).toBe(true);
    expect(result.current.isChecked(4)).toBe(true);
    expect(result.current.isChecked(6)).toBe(true);
  });

  it("should uncheck all children when parent is unchecked", () => {
    const initialData = sampleData.map((item) => ({
      ...item,
      checked: true,
      children: item.children?.map((child) => ({
        ...child,
        checked: true,
        children: child.children?.map((grandChild) => ({ ...grandChild, checked: true })),
      })),
    }));

    const { result } = renderHook(() => useRecursiveCheckList(initialData));

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.isChecked(3)).toBe(false);
    expect(result.current.isChecked(4)).toBe(false);
    expect(result.current.isChecked(6)).toBe(false);
  });

  it("should check all items", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.checkAll();
    });

    const allChecked = result.current.isAllChecked();
    expect(allChecked).toBe(true);
  });

  it("should uncheck all items", () => {
    const initialData = sampleData.map((item) => ({
      ...item,
      checked: true,
      children: item.children?.map((child) => ({
        ...child,
        checked: true,
        children: child.children?.map((grandChild) => ({ ...grandChild, checked: true })),
      })),
    }));

    const { result } = renderHook(() => useRecursiveCheckList(initialData));

    act(() => {
      result.current.uncheckAll();
    });

    const allUnchecked = result.current.isAllChecked();
    expect(allUnchecked).toBe(false);
  });

  it("should return checked ids", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggle(3);
      result.current.toggle(6);
    });

    const checkedIds = result.current.getCheckedIds();
    expect(checkedIds).toEqual([3, 6]);
  });

  it("should return checked items", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggle(3);
      result.current.toggle(6);
    });

    const checkedItems = result.current.getCheckedList();
    expect(checkedItems).toEqual([
      { id: 3, checked: true },
      { id: 6, checked: true },
    ]);
  });

  it("should find item by id", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    const foundItem = result.current.findItem(3);
    expect(foundItem).toEqual({ id: 3, checked: false });
  });

  it("should correctly check if all items are checked", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.checkAll();
    });

    const allChecked = result.current.isAllChecked();
    expect(allChecked).toBe(true);
  });

  it("should correctly check if not all items are checked", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggle(3);
    });

    const allChecked = result.current.isAllChecked();
    expect(allChecked).toBe(false);
  });

  it("should update all items to checked", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.updateAll(true);
    });

    expect(result.current.isAllChecked()).toBe(true);
  });

  it("should update all items to unchecked", () => {
    const initialData = sampleData.map((item) => ({
      ...item,
      checked: true,
      children: item.children?.map((child) => ({
        ...child,
        checked: true,
        children: child.children?.map((grandChild) => ({ ...grandChild, checked: true })),
      })),
    }));

    const { result } = renderHook(() => useRecursiveCheckList(initialData));

    act(() => {
      result.current.updateAll(false);
    });

    expect(result.current.isAllChecked()).toBe(false);
  });

  it("should toggle all items to checked if any unchecked", () => {
    const { result } = renderHook(() => useRecursiveCheckList(sampleData));

    act(() => {
      result.current.toggleAll();
    });

    expect(result.current.isAllChecked()).toBe(true);
  });

  it("should toggle all items to unchecked if all checked", () => {
    const initialData = sampleData.map((item) => ({
      ...item,
      checked: true,
      children: item.children?.map((child) => ({
        ...child,
        checked: true,
        children: child.children?.map((grandChild) => ({ ...grandChild, checked: true })),
      })),
    }));

    const { result } = renderHook(() => useRecursiveCheckList(initialData));

    act(() => {
      result.current.toggleAll();
    });

    expect(result.current.isAllChecked()).toBe(false);
  });
});
