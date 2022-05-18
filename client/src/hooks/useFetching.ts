import { useCallback, useState } from "react";

const useFetching = <T = any, D extends (...args: any[]) => Promise<T> = () => Promise<T>>(callback: Function, initialLoadingState = false) => {
  const [isLoading, setIsLoading] = useState(initialLoadingState);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<T>();

  const executeCallback = useCallback(async (...paramsArr) => {
    try {
      setIsLoading(true);
      const responseData = await callback(...paramsArr);
      setResponse(responseData);
      return responseData;
    } catch (e: any) {
      if (e.isAxiosError) {
        setError(e.response.data.message)
        alert(e.response.data.message);
        return null
      }
      alert(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callback])
  return { executeCallback: (executeCallback as D), isLoading, response, error };
}
export default useFetching;
