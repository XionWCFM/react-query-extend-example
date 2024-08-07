import { useCallback, useReducer } from "react";

// 재귀적 체크리스트 타입 정의
export type RecursiveCheckList = {
  id: number | string;
  checked: boolean;
  children?: RecursiveCheckList[];
};

// 액션 타입 정의
type Action<T extends RecursiveCheckList> =
  | {
      type: "TOGGLE_CHECK";
      target: T["id"];
    }
  | {
      type: "CHECK_ALL";
    }
  | {
      type: "UNCHECK_ALL";
    };

// 체크리스트 업데이트 함수
const updateParentCheckState = <T extends RecursiveCheckList>(item: T): T => {
  if (!item.children) return item;

  const allChecked = item.children.every((child) => child.checked);
  return {
    ...item,
    checked: allChecked,
    children: item.children.map(updateParentCheckState),
  };
};

const updateChildCheckState = <T extends RecursiveCheckList>(item: T, checked: boolean): T => {
  return {
    ...item,
    checked,
    children: item.children ? item.children.map((child) => updateChildCheckState(child, checked)) : item.children,
  };
};

// 재귀적으로 체크리스트를 관리하는 함수
export const computeCheckList = <T extends RecursiveCheckList>(itemList: T[], action: Action<T>): T[] => {
  switch (action.type) {
    case "TOGGLE_CHECK":
      return itemList
        .map((item) => {
          if (item.id === action.target) {
            const newChecked = !item.checked;
            return updateParentCheckState(updateChildCheckState(item, newChecked));
          } else if (item.children) {
            return {
              ...item,
              children: computeCheckList(item.children, action),
            };
          }
          return item;
        })
        .map(updateParentCheckState);
    case "CHECK_ALL":
      return itemList.map((item) => updateChildCheckState(item, true));
    case "UNCHECK_ALL":
      return itemList.map((item) => updateChildCheckState(item, false));
    default:
      return itemList;
  }
};

// 체크리스트 훅 타입 정의
type CheckListReturnType<T extends RecursiveCheckList> = {
  list: T[];
  dispatch: (action: Action<T>) => void;
  isChecked: (id: string | number) => boolean;
  isAllChecked: () => boolean;
  findItem: (id: string | number) => T | null;
  checkAll: () => void;
  uncheckAll: () => void;
  toggle: (id: string | number) => void;
  getCheckedList: () => T[];
  getCheckedIds: () => T["id"][];
  updateAll: (checked: boolean) => void;
  toggleAll: () => void;
};

// 체크리스트 관리 훅
export const useRecursiveCheckList = <T extends RecursiveCheckList>(list: T[]): CheckListReturnType<T> => {
  const [state, dispatch] = useReducer(computeCheckList<T>, list);

  const findItem = useCallback(
    (id: T["id"], items: T[] = state): T | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findItem(id, (item.children ?? []) as T[]);
          if (found) return found;
        }
      }
      return null;
    },
    [state],
  );

  const isChecked = useCallback(
    (id: T["id"]) => {
      const item = findItem(id);
      return item ? item.checked : false;
    },
    [findItem],
  );

  const checkAll = useCallback(() => dispatch({ type: "CHECK_ALL" }), []);

  const uncheckAll = useCallback(() => dispatch({ type: "UNCHECK_ALL" }), []);

  const toggle = useCallback((id: T["id"]) => dispatch({ type: "TOGGLE_CHECK", target: id }), []);

  const isAllChecked = useCallback(() => {
    const checkAllItems = (items: T[]): boolean =>
      items.every((item) => item.checked && (!item.children || checkAllItems((item.children ?? []) as T[])));
    return checkAllItems(state);
  }, [state]);

  const getCheckedIds = useCallback(() => {
    const collectCheckedIds = (items: T[]): T["id"][] => {
      return items.reduce<T["id"][]>((acc, item) => {
        if (item.checked) acc.push(item.id);
        if (item.children) acc.push(...collectCheckedIds((item.children ?? []) as T[]));
        return acc;
      }, []);
    };
    return collectCheckedIds(state);
  }, [state]);

  const getCheckedList = useCallback(() => {
    const collectCheckedItems = (items: T[]): T[] => {
      return items.reduce<T[]>((acc, item) => {
        if (item.checked) acc.push(item);
        if (item.children) acc.push(...collectCheckedItems((item.children ?? []) as T[]));
        return acc;
      }, []);
    };
    return collectCheckedItems(state);
  }, [state]);

  const updateAll = useCallback((checked: boolean) => (checked ? checkAll() : uncheckAll()), [checkAll, uncheckAll]);

  const toggleAll = useCallback(
    () => (isAllChecked() ? uncheckAll() : checkAll()),
    [isAllChecked, checkAll, uncheckAll],
  );

  return {
    list: state,
    dispatch,
    isChecked,
    isAllChecked,
    findItem,
    checkAll,
    uncheckAll,
    toggle,
    getCheckedIds,
    getCheckedList,
    updateAll,
    toggleAll,
  } as CheckListReturnType<T>;
};
