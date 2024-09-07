/* eslint-disable react/display-name */
import { Card, Text, Modal, Skeleton } from "@mantine/core";
import { forwardRef, useState } from "react";

/// local imports
import PostHeader from "@/components/PostHeader";
import PostBody from "@/components/PostBody";
import PostFooter from "@/components/PostFooter";

const MainCard = forwardRef(({ postObj, refetch }, ref) => {
  return (
    <div className="max-w-[502px] w-full" ref={ref}>
      <Card withBorder shadow="sm" radius="md">
        <Card.Section withBorder>
          <PostHeader padding={true} refetch={refetch} postObj={postObj} close={() => handleClose("postDetails")} />
        </Card.Section>
        <Card.Section>
          <PostBody  postObj={postObj} />
        </Card.Section>

        <Card.Section withBorder>
          <PostFooter  refetch={refetch} postObj={postObj} />
        </Card.Section>
      </Card>

    
    </div>
  );
});

export default MainCard;
