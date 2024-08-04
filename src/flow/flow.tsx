import { useState, useCallback } from "react";
import { NonEmptyArray } from "./funnel-component";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

type FlowOptions<T extends NonEmptyArray<string>> = {
  step?: T[number];
  onStepChange?: () => void;
  initialStep?: T[number];
};
