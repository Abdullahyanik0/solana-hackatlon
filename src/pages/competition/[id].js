/* eslint-disable @next/next/no-img-element */
import MainCard from "@/components/MainCard";
import { errorNotify } from "@/components/Notification";
import { memeData } from "@/data";
import { createPostService } from "@/service/post";
import { Badge, Button, Card, FileButton, Text } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import Masonry from "react-masonry-css";

const CompetitionDetail = () => {
  const router = useRouter();
  const breakpointColumnsObj = { default: 3, 1000: 2, 750: 1 };

  const { publicKey } = useWallet();
  const walletAdress = publicKey?.toBase58();

  const id = router.query?.id;

  const data = {
    coin: "Solana (SOL)",
    image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
    name: "Pirate Poet of Laughs",
    description:
      "80 memes, getting 500 likes, commenting 100 times and getting at least 100 comments from memes / participating in at least 10 contests",
    participant: 200,
    id: "098765456789",
    invest: 3000,
  };

  const sendImage = async (e) => {
    if (!walletAdress) return errorNotify("Please Log in");
    try {
      await createPostService(e, id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card className="flex flex-col md:flex-row gap-4 sm:gap-10 !justify-between" shadow="sm" padding="lg" radius="md" withBorder>
        <div className="">
          <img src={data?.image} alt={data?.name} />
        </div>

        <div className="w-full flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row text-start  justify-between gap-2 my-4 sm:items-center">
              <Text className="text-2xl md:text-4xl tewi" fw={500}>
                {data?.name}
              </Text>
              <Badge className="w-fit" color="grape" variant="light">
                {data?.coin}
              </Badge>
            </div>

            <Text lineClamp={2} size="sm" c="dimmed">
              {data?.description}{" "}
            </Text>
            <div className="flex justify-end">
              <Text mt={8} size="sm" c="dimmed">
                Participant: <span className="">{data?.participant} (Sol)</span>
              </Text>
            </div>
          </div>
          <div className="flex justify-start">
            <FileButton onChange={(e) => sendImage(e)} accept="image/png,image/jpeg">
              {(props) => (
                <Button {...props} mt="md" radius="md">
                  Add Meme
                </Button>
              )}
            </FileButton>
          </div>
        </div>
      </Card>

      <h1 className="font-display text-jacarta-700  text-3xl my-8 dark:text-white">Created memes</h1>

      <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid w-full" columnClassName="my-masonry-grid_column">
        {memeData?.map((postObj, i) => (
          <MainCard key={postObj._id + i} postObj={{ ...postObj }} />
        ))}
      </Masonry>
    </div>
  );
};

export default CompetitionDetail;
