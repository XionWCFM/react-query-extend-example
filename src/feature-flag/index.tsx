type FeatureFlagType = "new-feature";
type FeatureFlagOptionsType = { today?: Date; userId?: string };

type IsEnabeldType = (param: FeatureFlagType, context?: FeatureFlagOptionsType) => Promise<boolean> | boolean;

export const isEnabled: IsEnabeldType = (param, context) => {
  switch (param) {
    case "new-feature": {
      return true;
    }
    default: {
      return false;
    }
  }
};

export const useFeatureFlag = (): { isEnabled: IsEnabeldType } => {
  const isInternalEnabled: IsEnabeldType = (type, options) => {
    return isEnabled(type, options);
  };
  return { isEnabled: isInternalEnabled };
};
