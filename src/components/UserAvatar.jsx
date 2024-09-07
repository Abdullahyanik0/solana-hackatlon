/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Avatar } from "@mantine/core";

const UserAvatar = ({ user, size }) => {
  const userAvatar = user?.name?.charAt(0) + user?.lastName?.charAt(0);

  return (
    <Avatar classNames={{ placeholder: "rounded-full" }} size={size} className="uppercase !rounded-full">
      <img
        className="rounded-full aspect-square object-cover object-center"
        src={`https://pbs.twimg.com/profile_images/1679100194028392448/4_3L1nRh_400x400.jpg`}
        alt={user?.fullName}
      />
    </Avatar>
  );
};

export default UserAvatar;
