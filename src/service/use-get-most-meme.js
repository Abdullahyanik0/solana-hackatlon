import { useInfiniteQuery } from "react-query";
import { getMostMemeService } from "@/service/post";

const UseGetMostMeme = () => {
  const callback = async ({ pageParam = 0 }) => {
    const data = await getMostMemeService(10, pageParam);
    return data?.data;
  };

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(["getMostMemeService"], callback, {
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.totalCount;
      const currentPage = pages.length;
      if (currentPage * 10 < totalCount) {
        return currentPage;
      } else return undefined;
    },
  });

  const paginatedData = [];
  data?.pages?.forEach((page) => {
    paginatedData.push(...page.data);
  });

  return {
    data: paginatedData,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};

export default UseGetMostMeme;
