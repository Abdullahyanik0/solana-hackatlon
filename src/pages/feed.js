import MainCard from "@/components/MainCard";
import { getFeedService } from "@/service/competition";
import { Loader } from "@mantine/core";
import React from "react";
import Masonry from "react-masonry-css";
import { useQuery } from "react-query";

const breakpointColumnsObj = { default: 3, 1000: 2, 750: 1 };

const Feed = () => {
  const fetchFeed = async () => {
    const data = await getFeedService();
    return data?.data?.data;
  };

  const { data, error, isLoading, refetch } = useQuery(["feed"], fetchFeed);
  return (
    <div>
      <h1 className="mb-8">Feeds</h1>
      {data && (
        <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid w-full" columnClassName="my-masonry-grid_column">
          {data?.map((postObj, i) => {
            const isWinner = postObj?.creator;
            return <MainCard isWinner={isWinner} refetch={refetch} key={postObj._id + i} postObj={{ ...postObj }} />;
          })}
        </Masonry>
      )}
      {!data ||
        (data?.length == 0 && (
          <div className="flex justify-center items-center">
            <h2> No task has been added yet.</h2>
          </div>
        ))}
      {isLoading && (
        <div className="flex justify-center items-center">
          <Loader size="lg" />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center">
          <h2>An error has occurred</h2>
        </div>
      )}
    </div>
  );
};

export default Feed;
