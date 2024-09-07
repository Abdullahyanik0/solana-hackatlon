import { useCallback, useRef } from "react";

const useObserver = (fetchNextPage, hasNextPage, isFetchingNextPage) => {
  const intObserver = useRef();

  const observerRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "600px",
        }
      );

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );
  return observerRef;
};

export default useObserver;
