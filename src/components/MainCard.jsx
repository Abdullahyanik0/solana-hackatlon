/* eslint-disable react/display-name */
import { Card, Text, Modal, Skeleton } from "@mantine/core";
import PostHeader from "@/components/PostHeader";
import PostBody from "@/components/PostBody";
import PostFooter from "@/components/PostFooter";

const MainCard = ({ postObj, refetch }) => {
  return (
    <div className="max-w-[502px] w-full">
      <Card withBorder shadow="sm" radius="md">
        <Card.Section withBorder>
          <PostHeader padding={true} refetch={refetch} postObj={postObj} close={() => handleClose("postDetails")} />
        </Card.Section>
        <Card.Section>
          <PostBody postObj={postObj} />
        </Card.Section>

        <Card.Section withBorder>
          <PostFooter refetch={refetch} postObj={postObj} />
        </Card.Section>
      </Card>
    </div>
  );
};

export default MainCard;
