import { useCallback, useReducer } from "react";

type BaseCheckBox = { id: number | string; checked: boolean };

type Action<T extends BaseCheckBox> =
  | {
      type: "TOGGLE_CHECK";
      target: T["id"];
    }
  | {
      type: "CHECK_ALL";
    }
  | {
      type: "UNCHECK_ALL";
    }
  | {
      type: "CHECK_BY";
      checked: boolean;
      callback: (arg: T) => boolean;
    };

export const checkBoxReducer = <T extends BaseCheckBox>(itemList: T[], action: Action<T>) => {
  switch (action.type) {
    case "TOGGLE_CHECK":
      return itemList.map((item) => (item.id === action.target ? { ...item, checked: !item.checked } : item));
    case "CHECK_ALL":
      return itemList.map((item) => ({ ...item, checked: true }));
    case "UNCHECK_ALL":
      return itemList.map((item) => ({ ...item, checked: false }));
    case "CHECK_BY":
      return itemList.map((item) => ({ ...item, checked: action.callback(item) ? action.checked : item.checked }));
    default:
      return itemList;
  }
};

const _findItem = <T extends BaseCheckBox>(itemList: T[], findItem: T["id"]) => {
  return itemList.find((item) => item.id === findItem) ?? null;
};

const _findIndex = <T extends BaseCheckBox>(itemList: T[], findItem: T["id"]) => {
  const result = itemList.findIndex((item) => item.id === findItem);
  return result !== -1 ? result : null;
};

type CheckListReturnType<T extends BaseCheckBox> = {
  list: T[];
  dispatch: (action: Action<T>) => void;
  isChecked: (id: T["id"]) => boolean;
  isAllChecked: () => boolean;
  findItem: (id: T["id"]) => T | null;
  findIndex: (id: T["id"]) => number | null;
  checkAll: () => void;
  uncheckAll: () => void;
  toggle: (id: T["id"]) => void;
  getCheckedList: () => T[];
  getCheckedIds: () => T["id"][];
  updateAll: (checked: boolean) => void;
  toggleAll: () => void;
  updateItem: (id: T["id"], checked: boolean) => void;
  checkBy: (toggle: boolean, fn: (arg: T) => boolean) => void;
  isCheckedBy: (fn: (arg: T) => boolean) => boolean;
};

/**
 * Custom hook to manage a checklist.
 *
 * @template T - The type of items in the checklist.
 * @param {T[]} list - The initial list of items.
 * @returns {CheckListReturnType<T>} The checklist state and actions to manipulate it.
 */
export const useCheckList = <T extends BaseCheckBox>(list: T[]): CheckListReturnType<T> => {
  const [state, dispatch] = useReducer(checkBoxReducer<T>, list);

  const findItem = useCallback((id: T["id"]) => _findItem<T>(state, id), [state]);

  const findIndex = useCallback((id: T["id"]) => _findIndex(state, id), [state]);

  const isChecked = useCallback((id: T["id"]) => findItem(id)?.checked || false, [findItem]);

  const checkAll = useCallback(() => dispatch({ type: "CHECK_ALL" }), []);

  const uncheckAll = useCallback(() => dispatch({ type: "UNCHECK_ALL" }), []);

  const toggle = useCallback((id: T["id"]) => dispatch({ type: "TOGGLE_CHECK", target: id }), []);

  const isAllChecked = useCallback(() => state.every((item) => item.checked), [state]);

  const getCheckedIds = useCallback(() => state.filter((item) => item.checked).map((item) => item.id), [state]);

  const getCheckedList = useCallback(() => state.filter((item) => item.checked), [state]);

  const updateAll = useCallback((checked: boolean) => (checked ? checkAll() : uncheckAll()), [checkAll, uncheckAll]);

  const toggleAll = useCallback(
    () => (isAllChecked() ? uncheckAll() : checkAll()),
    [isAllChecked, checkAll, uncheckAll],
  );

  const isCheckedBy = useCallback(
    (fn: (arg: T) => void) => {
      return state.filter((item) => fn(item)).every((item) => item.checked);
    },
    [state],
  );

  const checkBy = useCallback((toggle: boolean, fn: (arg: T) => boolean) => {
    dispatch({ type: "CHECK_BY", checked: toggle, callback: fn });
  }, []);

  return {
    list: state,
    dispatch,
    isChecked,
    isAllChecked,
    findItem,
    findIndex,
    checkAll,
    uncheckAll,
    toggle,
    getCheckedIds,
    getCheckedList,
    updateAll,
    toggleAll,
    checkBy,
    isCheckedBy,
  } as unknown as CheckListReturnType<T>;
};
