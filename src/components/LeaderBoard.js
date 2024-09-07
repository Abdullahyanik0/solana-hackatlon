import { Table, Text } from "@mantine/core";
import React from "react";
import CustomTable from "@/components/CustomTable";
import UserAvatar from "@/components/UserAvatar";
import dayjs from "dayjs";
import Link from "next/link";

const leaderColumn = ["", "Account name", "Like", "Comment", "Coin", "Date"];
const LeaderBoard = () => {
  const leaderData = [
    {
      like: 20,
      comment: 50,
      coin: "Bitcoin (BTC)",
      date: "2023-12-23T17:21:48.116+00:00",
      user: {
        _id: "6587172ced9486b2834cd061",
        account_name: "empaty16",
        bio: "Hover card is revealed when elements user hovers over target element, it will be hidden once mouse is not over both target and dropdown elements mouse is not over both target and dropdown elements2222",
        lastName: "yanık",
        name: "abdullah",
        profile_pic: "assets/071e08f7-4719-4aa9-9ec2-0840f8431b78",
        security_type: "public",
        follower: 0,
        followers: 1,
        me: true,
        following: false,
        followRequest: false,
        blocked: false,
      },
    },
    {
      like: 20,
      comment: 50,
      coin: "Bitcoin (BTC)",
      date: "2023-12-23T17:21:48.116+00:00",
      user: {
        _id: "6587172ced9486b2834cd061",
        account_name: "empaty16",
        bio: "Hover card is revealed when elements user hovers over target element, it will be hidden once mouse is not over both target and dropdown elements mouse is not over both target and dropdown elements2222",
        lastName: "yanık",
        name: "abdullah",
        profile_pic: "assets/071e08f7-4719-4aa9-9ec2-0840f8431b78",
        security_type: "public",
        follower: 0,
        followers: 1,
        me: true,
        following: false,
        followRequest: false,
        blocked: false,
      },
    },
    {
      like: 20,
      comment: 50,
      coin: "Bitcoin (BTC)",
      date: "2023-12-23T17:21:48.116+00:00",
      user: {
        _id: "6587172ced9486b2834cd061",
        account_name: "empaty16",
        bio: "Hover card is revealed when elements user hovers over target element, it will be hidden once mouse is not over both target and dropdown elements mouse is not over both target and dropdown elements2222",
        lastName: "yanık",
        name: "abdullah",
        profile_pic: "assets/071e08f7-4719-4aa9-9ec2-0840f8431b78",
        security_type: "public",
        follower: 0,
        followers: 1,
        me: true,
        following: false,
        followRequest: false,
        blocked: false,
      },
    },
    {
      like: 20,
      comment: 50,
      coin: "Bitcoin (BTC)",
      date: "2023-12-23T17:21:48.116+00:00",
      user: {
        _id: "6587172ced9486b2834cd061",
        account_name: "empaty16",
        bio: "Hover card is revealed when elements user hovers over target element, it will be hidden once mouse is not over both target and dropdown elements mouse is not over both target and dropdown elements2222",
        lastName: "yanık",
        name: "abdullah",
        profile_pic: "assets/071e08f7-4719-4aa9-9ec2-0840f8431b78",
        security_type: "public",
        follower: 0,
        followers: 1,
        me: true,
        following: false,
        followRequest: false,
        blocked: false,
      },
    },
  ];

  const rows = leaderData?.map((item, i) => (
    <Table.Tr key={item.id}>
      <Table.Td className="text-center">{i}</Table.Td>
      <Table.Td>
        <Link href={`/profile/${item?.user?.account_name}`}>
          <div className="flex items-center gap-2 group transition-all">
            <UserAvatar user={item?.user} />
            <Text className="group-hover:!text-first-color">{item?.user?.account_name}</Text>
          </div>
        </Link>
      </Table.Td>
      <Table.Td>{item.comment}</Table.Td>
      <Table.Td>{item.like}</Table.Td>
      <Table.Td>{item.coin}</Table.Td>
      <Table.Td>{dayjs(item.date).format("DD MMMM hh:mm")}</Table.Td>
    </Table.Tr>
  ));

  const total = 0;
  const activePage = 0;
  const limit = 0;
  const loading = false;

  return (
    <div>
      <CustomTable activePage={activePage} limit={limit} rows={rows} cols={leaderColumn} loading={loading} />
    </div>
  );
};

export default LeaderBoard;
