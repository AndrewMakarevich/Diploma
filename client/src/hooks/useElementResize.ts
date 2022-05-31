import { useCallback, useEffect, useState } from "react";

const useWindowResize = (callback: Function) => {
  const [elementSize, setElementSize] = useState({
    width: 0,
    height: 0
  });

  const onSetElementSize = useCallback(() => {
    setElementSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    callback();
  }, [callback])

  useEffect(() => {
    window.addEventListener("resize", onSetElementSize);
    return () => { window.removeEventListener("resize", onSetElementSize) };
  }, [onSetElementSize]);

  return elementSize;
}

export default useWindowResize;