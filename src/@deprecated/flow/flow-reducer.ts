import { FlowStateType, FlowAction } from "./flow-type";
import { NonEmptyArray } from "./funnel-and-step";

export const flowReducer = <T extends NonEmptyArray<string>>(
  state: FlowStateType<T>,
  action: FlowAction<T>,
): FlowStateType<T> => {
  const { type, payload } = action;
  switch (type) {
    case "CLEAR": {
      return {
        ...state,
        step: state.stepList[0],
        historyStack: [],
      };
    }
    case "NEXT_STEP": {
      if (state.step === payload) return state;
      return {
        ...state,
        step: payload,
        historyStack: [...state.historyStack, state.step],
      };
    }

    case "BACK": {
      const historyStack = state.historyStack.slice();
      const num = payload ?? 1;
      let pop: T[number] = state.stepList[0];
      for (let i = 0; i < num; i++) {
        const popResult = historyStack.pop();
        if (popResult) {
          pop = popResult;
        } else {
          break;
        }
      }
      return { ...state, historyStack: historyStack, step: pop ?? state.stepList[0] };
    }

    case "REMOVE_STEP": {
      const stepList = Array.isArray(payload) ? payload : [payload];
      const filteredHistoryStack = state.historyStack.filter((step) => !stepList.includes(step));
      return {
        ...state,
        step: state.step,
        historyStack: filteredHistoryStack,
      };
    }
    case "REPLACE_STEP": {
      if (state.step === payload) return state;
      return {
        ...state,
        step: payload,
      };
    }

    default:
      throw new Error("Invalid action type");
  }
};
