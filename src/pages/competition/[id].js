/* eslint-disable @next/next/no-img-element */
import MainCard from "@/components/MainCard";
import { errorNotify } from "@/components/Notification";
import useCountdown from "@/hooks/use-countdown";
import { getSingleCompetitionService } from "@/service/competition";
import { createMemeService } from "@/service/meme";
import { Badge, Button, Card, FileButton, Loader, Text } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import Masonry from "react-masonry-css";
import { useQuery } from "react-query";

const CompetitionDetail = () => {
  const router = useRouter();
  const breakpointColumnsObj = { default: 3, 1000: 2, 750: 1 };

  const { publicKey } = useWallet();
  const walletAdress = publicKey?.toBase58();

  const id = router.query?.id;

  const fetchCompetitions = async () => {
    const data = await getSingleCompetitionService(id);
    return data?.data?.data;
  };

  const { data, error, isLoading, refetch } = useQuery(
    ["competitions-detail"],
    fetchCompetitions
  );

  console.log("data", data);

  const { days, hours, minutes, seconds } = useCountdown(
    data?.competitionDetail?.expireTime
  );

  const sendImage = async (e) => {
    if (!walletAdress) return errorNotify("Please Log in");
    try {
      await createMemeService(e, id, walletAdress);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {!isLoading && (
        <Card
          className="flex flex-col md:flex-row gap-4 sm:gap-10 !justify-between"
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
        >
          <div className="max-w-sm w-full">
            <img
              src={data?.competitionDetail?.image}
              alt={data?.competitionDetail?.name}
            />
          </div>

          <div className="w-full flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row text-start  justify-between gap-2 my-4 sm:items-center">
                <Text className="text-2xl md:text-4xl tewi" fw={500}>
                  {data?.competitionDetail?.name}
                </Text>
                <Badge className="w-fit" color="grape" variant="light">
                  Solana (SOL)
                </Badge>
              </div>

              <Text lineClamp={2} size="sm" c="dimmed">
                {data?.competitionDetail?.description}{" "}
              </Text>
              <div className="flex justify-between items-center mt-4">
                <Text size="sm" c="dimmed">
                  Remaining time: {days}:{hours}:{minutes}:{seconds}
                </Text>
                <Text size="sm" c="dimmed">
                  Reward:{" "}
                  <span className="">
                    {data?.competitionDetail?.reward} (Sol)
                  </span>
                </Text>
              </div>
            </div>
            <div className="flex justify-start">
              <FileButton
                onChange={(e) => sendImage(e)}
                accept="image/png,image/jpeg"
              >
                {(props) => (
                  <Button {...props} mt="md" radius="md">
                    Add Meme
                  </Button>
                )}
              </FileButton>
            </div>
          </div>
        </Card>
      )}

      <h1 className="font-display text-jacarta-700  text-3xl my-8 dark:text-white">
        Created memes
      </h1>

      {data?.applies && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid w-full"
          columnClassName="my-masonry-grid_column"
        >
          {data?.applies?.map((postObj, i) => (
            <MainCard
              refetch={refetch}
              key={postObj._id + i}
              postObj={{ ...postObj }}
            />
          ))}
        </Masonry>
      )}
      {!data?.applies && !isLoading && (
        <div className="flex justify-center items-center">
          <h2> Henüz meme eklenmedi.</h2>
        </div>
      )}
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

export default CompetitionDetail;
