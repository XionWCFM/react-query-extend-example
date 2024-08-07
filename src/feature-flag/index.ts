type FeatureFlagType = "new-feature";
type FeatureFlagOptionsType = { today?: Date; userId?: string };

type IsEnabeldType = (param: FeatureFlagType, context?: FeatureFlagOptionsType) => Promise<boolean> | boolean;

const useFeatureFlag = (): { isEnabled: IsEnabeldType } => {
  const isEnabled: IsEnabeldType = (type, options) => {
    return true;
  };
  return { isEnabled };
};
