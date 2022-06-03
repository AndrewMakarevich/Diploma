import { useCallback, useEffect, useRef } from "react";
import useWindowResize from "../../hooks/useElementResize";
import useFetching from "../../hooks/useFetching";

import scrollStyles from "./infinite-scroll.module.css";

interface IInfiniteScrollProps {
  callback: (rewrite: boolean) => Promise<unknown>;
  stopValue: boolean;
  children: any;
  rewrite: boolean;
}

const InfiniteScroll = ({ callback, children, stopValue, rewrite }: IInfiniteScrollProps) => {
  const { executeCallback, isLoading } = useFetching(callback);
  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null);
  const infiniteScroll = useCallback(async () => {
    if (isLoading || !infiniteScrollContainerRef.current || stopValue) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = infiniteScrollContainerRef.current;
    if (scrollHeight - clientHeight - scrollTop < 25) {
      executeCallback(rewrite);
    }
  }, [isLoading, executeCallback, rewrite, infiniteScrollContainerRef, stopValue])

  useEffect(() => {
    if (!isLoading) {
      console.log(2);
      infiniteScroll();
    }
  }, [isLoading]);

  useEffect(() => {
    if (rewrite && infiniteScrollContainerRef.current) {
      console.log(1);
      infiniteScrollContainerRef.current.scrollTop = 0;
      infiniteScroll();
    }
  }, [rewrite]);

  useWindowResize(infiniteScroll);

  return (
    <div ref={infiniteScrollContainerRef} className={scrollStyles["container"]} onScroll={infiniteScroll}>
      {children}
    </div>
  )
};

export default InfiniteScroll;