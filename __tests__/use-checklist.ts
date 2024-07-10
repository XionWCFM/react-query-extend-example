import { useCallback, useReducer } from "react";

type DefaultCheckList = { id: number | string; checked: boolean };

type Action<T extends DefaultCheckList> =
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

export const computeCheckList = <T extends DefaultCheckList>(itemList: T[], action: Action<T>) => {
  switch (action.type) {
    case "TOGGLE_CHECK":
      return itemList.map((item) => (item.id === action.target ? { ...item, checked: !item.checked } : item));
    case "CHECK_ALL":
      return itemList.map((item) => ({ ...item, checked: true }));
    case "UNCHECK_ALL":
      return itemList.map((item) => ({ ...item, checked: false }));
    default:
      return itemList;
  }
};

const _findItem = <T extends DefaultCheckList>(itemList: T[], findItem: T["id"]) => {
  return itemList.find((item) => item.id === findItem) ?? null;
};

const _findIndex = <T extends DefaultCheckList>(itemList: T[], findItem: T["id"]) => {
  const result = itemList.findIndex((item) => item.id === findItem);
  return result !== -1 ? result : null;
};

type CheckListReturnType<T extends DefaultCheckList> = {
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
};

/**
 * Custom hook to manage a checklist.
 *
 * @template T - The type of items in the checklist.
 * @param {T[]} list - The initial list of items.
 * @returns {CheckListReturnType<T>} The checklist state and actions to manipulate it.
 */
export const useCheckList = <T extends DefaultCheckList>(list: T[]): CheckListReturnType<T> => {
  const [state, dispatch] = useReducer(computeCheckList<T>, list);

  /**
   * Finds an item in the checklist by its id.
   *
   * @param {T["id"]} id - The id of the item to find.
   * @returns {T | null} The item if found, otherwise null.
   */
  const findItem = useCallback((id: T["id"]) => _findItem<T>(state, id), [state]);

  /**
   * Finds the index of an item in the checklist by its id.
   *
   * @param {T["id"]} id - The id of the item to find.
   * @returns {number | null} The index of the item if found, otherwise null.
   */
  const findIndex = useCallback((id: T["id"]) => _findIndex(state, id), [state]);

  /**
   * Checks if an item is checked.
   *
   * @param {T["id"]} id - The id of the item to check.
   * @returns {boolean} True if the item is checked, otherwise false.
   */
  const isChecked = useCallback((id: T["id"]) => findItem(id)?.checked || false, [findItem]);

  /**
   * Checks all items in the checklist.
   */
  const checkAll = useCallback(() => dispatch({ type: "CHECK_ALL" }), []);

  /**
   * Unchecks all items in the checklist.
   */
  const uncheckAll = useCallback(() => dispatch({ type: "UNCHECK_ALL" }), []);

  /**
   * Toggles the checked state of an item.
   *
   * @param {T["id"]} id - The id of the item to toggle. 토글할 아이템의 id.
   */
  const toggle = useCallback((id: T["id"]) => dispatch({ type: "TOGGLE_CHECK", target: id }), []);

  /**
   * Checks if all items in the checklist are checked.
   *
   * @returns {boolean} True if all items are checked, otherwise false.
   */
  const isAllChecked = useCallback(() => state.every((item) => item.checked), [state]);

  /**
   * Returns the ids of all checked items.
   *
   * @returns {T["id"][]} An array of ids of all checked items.
   */
  const getCheckedIds = useCallback(() => state.filter((item) => item.checked).map((item) => item.id), [state]);

  /**
   * Returns all checked items.
   *
   * @returns {T[]} An array of all checked items.
   */
  const getCheckedList = useCallback(() => state.filter((item) => item.checked), [state]);

  /**
   * Updates the checked state of all items.
   *
   * @param {boolean} checked - The new checked state.
   */
  const updateAll = useCallback((checked: boolean) => (checked ? checkAll() : uncheckAll()), [checkAll, uncheckAll]);

  /**
   * Toggles the checked state of all items.
   */
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
    findIndex,
    checkAll,
    uncheckAll,
    toggle,
    getCheckedIds,
    getCheckedList,
    updateAll,
    toggleAll,
  } as CheckListReturnType<T>;
};
