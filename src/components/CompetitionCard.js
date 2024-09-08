/* eslint-disable @next/next/no-img-element */
import useCountdown from "@/hooks/use-countdown";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";

const CompetitionCard = ({ item }) => {
  const { days, hours, minutes, seconds, isFinish } = useCountdown(item?.expireTime);

  const isWinner = item?.winner;

  return (
    <Link href={`/competition/${item?._id}`}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <img className="w-full h-full object-cover" src={item?.image} alt={item?.name} />
          {/*         <Image className="select-none" loading="eager" width={500} height={500} src={item?.image} alt={item?.name} fit="cover" />
           */}
        </Card.Section>

        <div className="flex justify-between gap-2 mt-4 items-center">
          <Text fw={500}>{item?.name}</Text>
          <Badge color="grape" variant="light">
            Solana (SOL)
          </Badge>
        </div>

        <Text className="min-h-[45px] h-full" lineClamp={2} size="sm" c="dimmed">
          {item?.description}{" "}
        </Text>
        <div className="flex justify-between items-center mt-4">
          <Text size="sm" c="dimmed">
            {!isFinish ? (
              <>
                Remaining time: {days}:{hours}:{minutes}:{seconds}
              </>
            ) : (
              "The mission is over"
            )}
          </Text>
          <Text c="dimmed">
            Reward: <span className="">{item?.reward} (Sol)</span>
          </Text>
        </div>
        {isWinner && (
          <Text className="break-words " mt="lg" c="dimmed">
            Winner: <span className="">{isWinner}</span>
          </Text>
        )}

        <Button fullWidth mt="md" radius="md">
          Join Competition
        </Button>
      </Card>
    </Link>
  );
};
export default CompetitionCard;
