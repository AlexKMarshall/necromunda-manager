import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

type RenderParams = Parameters<typeof rtlRender>;

function render(ui: RenderParams[0], options: RenderParams[1] = {}) {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return rtlRender(ui, { wrapper, ...options });
}

function waitForLoadingToFinish() {
  return waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);
}

export * from "@testing-library/react";
export { render, waitForLoadingToFinish };
