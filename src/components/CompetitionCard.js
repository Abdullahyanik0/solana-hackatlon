/* eslint-disable @next/next/no-img-element */
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";

const CompetitionCard = ({ item }) => {
  return (
    <Link href={`/competition/${item?.id}`}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <img src={item?.image} alt={item?.name} />
          {/*         <Image className="select-none" loading="eager" width={500} height={500} src={item?.image} alt={item?.name} fit="cover" />
           */}
        </Card.Section>

        <div className="flex justify-between gap-2 mt-4 items-center">
          <Text fw={500}>{item?.name}</Text>
          <Badge color="grape" variant="light">
            {item?.coin}
          </Badge>
        </div>

        <Text lineClamp={2} size="sm" c="dimmed">
          {item?.description}{" "}
        </Text>
        <div className="flex justify-end">
          <Text mt={8} size="sm" c="dimmed">
            Participant: <span className="">{item?.participant}</span>
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
