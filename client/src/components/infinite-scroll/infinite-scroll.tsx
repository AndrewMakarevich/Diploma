import { useCallback, useEffect, useRef } from "react";
import useWindowResize from "../../hooks/useElementResize";
import useFetching from "../../hooks/useFetching";

import scrollStyles from "./infinite-scroll.module.css";

interface IInfiniteScrollProps {
  callback: (rewrite: boolean, unmountFlag: React.MutableRefObject<boolean>) => Promise<unknown>;
  stopValue: boolean;
  children: any;
  rewrite: boolean;
  maxHeight?: string;
}

const InfiniteScroll = ({ callback, children, stopValue, rewrite, maxHeight = "80vh" }: IInfiniteScrollProps) => {
  const unmountFlag = useRef(false);
  const { executeCallback, isLoading } = useFetching(callback);
  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null);
  const infiniteScroll = useCallback(async () => {
    if (isLoading || !infiniteScrollContainerRef.current || (stopValue && !rewrite)) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = infiniteScrollContainerRef.current;

    if ((scrollHeight - clientHeight - scrollTop < 25) || rewrite) {
      await executeCallback(rewrite, unmountFlag);
    }
  }, [isLoading, executeCallback, rewrite, infiniteScrollContainerRef, stopValue])

  useEffect(() => {
    if (!isLoading && !stopValue) {
      infiniteScroll();
    }
  }, [isLoading, stopValue]);

  useEffect(() => {
    if (rewrite) {
      infiniteScroll();
    }
  }, [rewrite])

  useEffect(() => {
    return () => {
      unmountFlag.current = true;
    }
  }, [])

  useWindowResize(infiniteScroll);

  return (
    <div ref={infiniteScrollContainerRef} className={scrollStyles["container"]} onScroll={infiniteScroll} style={{ maxHeight: maxHeight }}>
      {children}
    </div>
  )
};

export default InfiniteScroll;