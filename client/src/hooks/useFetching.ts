import { useCallback, useState } from "react";

const useFetching = <T, K extends Array<unknown>>(callback: (...args: K) => Promise<T>, initialLoadingState = false) => {
  const [isLoading, setIsLoading] = useState(initialLoadingState);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<T>();

  const executeCallback = useCallback(async (...paramsArr: Parameters<typeof callback>) => {
    try {
      setIsLoading(true);
      const responseData = await callback(...paramsArr);
      setResponse(responseData);
      return responseData;
    } catch (e: any) {
      if (e.isAxiosError) {
        setError(e.response.data.message)
        alert(e.response.data.message);
      } else {
        setError(e.message)
        alert(e.message)
      }
    } finally {
      setIsLoading(false);
    }
  }, [callback])
  return { executeCallback, isLoading, response, error };
}
export default useFetching;
