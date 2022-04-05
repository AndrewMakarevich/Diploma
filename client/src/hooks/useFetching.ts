import { AxiosError } from "axios";
import { useState } from "react";

const useFetching = <T>(callback: Function) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<T>();

  const executeCallback = async () => {
    try {
      setIsLoading(true);
      const responseData = await callback();
      setResponse(responseData);
    } catch (e: Error | AxiosError | any) {
      alert(e.response.data.message)
    } finally {
      setIsLoading(false);
    }
  }
  return { executeCallback, isLoading, response };
}
export default useFetching;
