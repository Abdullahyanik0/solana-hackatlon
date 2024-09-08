/* eslint-disable @next/next/no-img-element */
import useCountdown from "@/hooks/use-countdown";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";

const CompetitionCard = ({ item }) => {
  const { days, hours, minutes, seconds } = useCountdown(item?.expireTime);
  return (
    <Link href={`/competition/${item?._id}`}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <img src={item?.image} alt={item?.name} />
          {/*         <Image className="select-none" loading="eager" width={500} height={500} src={item?.image} alt={item?.name} fit="cover" />
           */}
        </Card.Section>

        <div className="flex justify-between gap-2 mt-4 items-center">
          <Text fw={500}>{item?.name}</Text>
          <Badge color="grape" variant="light">
            Solana (SOL)
          </Badge>
        </div>

        <Text lineClamp={2} size="sm" c="dimmed">
          {item?.description}{" "}
        </Text>
        <div className="flex justify-between items-center mt-4">
          <Text size="sm" c="dimmed">
            Remaining time: {days}:{hours}:{minutes}:{seconds}
          </Text>
          <Text size="sm" c="dimmed">
            Reward: <span className="">{item?.reward} (Sol)</span>
          </Text>
        </div>

        <Button fullWidth mt="md" radius="md">
          Join Competition
        </Button>
      </Card>
    </Link>
  );
};
export default CompetitionCard;
