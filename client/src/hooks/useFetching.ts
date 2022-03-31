import { AxiosError } from "axios";
import { useState } from "react";

const useFetching = (callback: Function) => {
  const [isLoading, setIsLoading] = useState(false);

  const executeCallback = async () => {
    try {
      setIsLoading(true);
      await callback()
    } catch (e: Error | AxiosError | any) {
      alert(e.response.data.message)
    } finally {
      setIsLoading(false);
    }
  }
  return { executeCallback, isLoading };
}
export default useFetching;
