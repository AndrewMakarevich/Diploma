import { AxiosError } from "axios";
import { useCallback, useRef, useState } from "react";

const useDelayFetching = <T, K extends unknown[]>(callback: (...args: K) => Promise<T>, delay: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<T>();

  let timeout: ReturnType<typeof setTimeout> = setTimeout(() => { }, 0);
  const timeoutVariableRef = useRef(timeout);

  const executeCallback = useCallback((...paramsArr: Parameters<typeof callback>) => {

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