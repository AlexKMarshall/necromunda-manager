import React from "react";

function useSafeDispatch(dispatch: (...args: any[]) => void) {
  const mounted = React.useRef(false);

  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
}
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: any };

const defaultInitialState = {
  status: "idle" as const,
};

export function useAsync<T>(initialState: AsyncState<T> = defaultInitialState) {
  const initialStateRef = React.useRef(initialState);

  const [state, setState] = React.useState(initialStateRef.current);

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    (data: T) => safeSetState({ data, status: "success" }),
    [safeSetState]
  );
  const setError = React.useCallback(
    (error: any) => safeSetState({ error, status: "error" }),
    [safeSetState]
  );
  const reset = React.useCallback(() => safeSetState({ status: "idle" }), [
    safeSetState,
  ]);

  const run = React.useCallback(
    (promise: Promise<T>) => {
      if (state.status === "loading") return void 0;

      safeSetState({ status: "loading" });
      return promise.then(
        (data) => {
          setData(data);
          return data;
        },
        (error) => {
          setError(error);
          return Promise.reject(error);
        }
      );
    },
    [safeSetState, setData, setError, state]
  );

  return {
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    data: state.status === "success" ? state.data : undefined,
    error: state.status === "error" ? state.error : undefined,
    run,
    reset,
    status: state.status,
  };
}

export interface AsyncButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (...args: any[]) => Promise<any>;
}

export function useAsyncButton() {
  const { isLoading, isError, error, run } = useAsync();

  const handleClick = (onClick: (...args: any[]) => Promise<any>) => () => {
    run(onClick());
  };

  const getAsyncButtonProps = ({
    onClick,
    disabled,
    ...props
  }: AsyncButtonProps) => ({
    onClick: handleClick(onClick),
    disabled: disabled || isLoading,
    ...props,
  });

  return {
    isLoading,
    isError,
    error,
    getAsyncButtonProps,
  };
}
