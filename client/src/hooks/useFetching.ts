import { useCallback, useState } from "react";

const useFetching = <T>(callback: Function) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<T>();

  const executeCallback = useCallback(async (...paramsArr) => {
    console.log(paramsArr);
    try {
      setIsLoading(true);
      const responseData = await callback(...paramsArr);
      setResponse(responseData);
      console.log(responseData);
    } catch (e: any) {
      if (e.isAxiosError) {
        alert(e.response.data.message);
        return;
      }
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [callback])
  return { executeCallback, isLoading, response };
}
export default useFetching;
