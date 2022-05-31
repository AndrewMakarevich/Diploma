import { useEffect, useRef } from "react";
import useFetching from "../../hooks/useFetching";

import scrollStyles from "./infinite-scroll.module.css";

interface IInfiniteScrollProps {
  callback: () => Promise<unknown>;
  stopValue: boolean
  children: any
}

const InfiniteScroll = ({ callback, children, stopValue }: IInfiniteScrollProps) => {
  const { executeCallback, isLoading } = useFetching(callback);
  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null);
  const infiniteScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!infiniteScrollContainerRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = infiniteScrollContainerRef.current;
    if (scrollTop === scrollHeight - clientHeight) {
      executeCallback();
    }
  }

  useEffect(() => {
    if (isLoading || !infiniteScrollContainerRef.current || stopValue) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = infiniteScrollContainerRef.current;
    if (scrollTop === scrollHeight - clientHeight) {
      executeCallback();
    }
  }, [isLoading]);

  return (
    <div ref={infiniteScrollContainerRef} className={scrollStyles["container"]} onScroll={infiniteScroll}>
      {children}
    </div>
  )
};

export default InfiniteScroll;