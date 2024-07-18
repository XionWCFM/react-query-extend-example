import { FlowPlugin, FlowStateType } from "./flow-type";
import { NonEmptyArray } from "./funnel-and-step";

export const createLocalStoragePlugin = <T extends NonEmptyArray<string>>(key: string): FlowPlugin<T> => {
  return {
    type: "storage",
    save(state: FlowStateType<T>) {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(state));
      }
    },
    load() {
      if (typeof window !== "undefined") {
        const savedState = localStorage.getItem(key);
        if (savedState) {
          try {
            return JSON.parse(savedState) as FlowStateType<T>;
          } catch (error) {
            console.error("Failed to parse flow state from local storage:", error);
          }
        }
      }
      return null;
    },
  };
};

export const createNavigationPlugin = <T extends NonEmptyArray<string>>(): FlowPlugin<T> => {
  return {
    type: "navigation",
    onNavigate(prevState, newState) {
      if (typeof window === "undefined") return;
      const stackCount = newState.historyStack.length;
      if (stackCount > prevState.historyStack.length) {
        window.history.pushState({ stackCount }, "", "");
      } else if (stackCount < prevState.historyStack.length) {
        window.history.replaceState({ stackCount }, "", "");
      }
    },
  };
};
