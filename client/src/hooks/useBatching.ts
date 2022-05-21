import { useCallback, useRef, useState } from "react";

const useBatching = <T, D extends []>(callback: (...args: D) => T) => {
  const allowToExecute = useRef(true);

  const executeBatch = useCallback(async (...args: Parameters<typeof callback>) => {
    if (allowToExecute.current) {
      allowToExecute.current = false;
      await callback(...args);
      setTimeout(() => { allowToExecute.current = true }, 100);
    }
  }, [callback]);

  return { executeBatch }
};

export default useBatching;