import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { wrapper } from "./wrapper";

export const setupWithUser = <T extends JSX.Element>(
  ui: T,
  options?: Parameters<typeof render>[1],
) => {
  const user = userEvent.setup();
  return { ...render(ui, { wrapper: wrapper(), ...options }), user };
};
