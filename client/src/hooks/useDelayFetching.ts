import { AxiosError } from "axios";
import { useCallback, useRef, useState } from "react";

const useDelayFetching = <T>(callback: Function, delay: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<T>();

  let timeout: ReturnType<typeof setTimeout> = setTimeout(() => { }, 0);
  const timeoutVariableRef = useRef(timeout);

  const executeCallback = useCallback((params?: any) => {
    const paramsArr: Array<number | string | string[]> = [];

    for (let key in params) {
      paramsArr.push(params[key]);
    };

    clearTimeout(timeoutVariableRef.current);

    timeoutVariableRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await callback(...paramsArr);
        setExecuteResult(response);
      } catch (e: Error | AxiosError | any) {
        alert(e.message);

        return null;
      } finally {
        setIsLoading(false);
      }
    }, delay);
  }, [callback, delay]);

  return { executeCallback, executeResult, isLoading };

}

export default useDelayFetching;