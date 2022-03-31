import { AxiosError } from "axios";
import { useRef, useState } from "react";

const useDelayFetching = <T>(callback: Function, delay: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<T>();

  let timeout: ReturnType<typeof setTimeout> = setTimeout(() => { }, 0);
  const timeoutVariableRef = useRef(timeout);

  const executeCallback = () => {
    clearTimeout(timeoutVariableRef.current);

    timeoutVariableRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await callback();
        setExecuteResult(response);
      } catch (e: Error | AxiosError | any) {
        alert(e.response.data.message);

        return null;
      } finally {
        setIsLoading(false);
      }
    }, delay);
  }

  return { executeCallback, executeResult, isLoading };

}

export default useDelayFetching;