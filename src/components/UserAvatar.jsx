/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Avatar } from "@mantine/core";

const UserAvatar = ({ user, size }) => {
  const userAvatar = user?.name?.charAt(0) + user?.lastName?.charAt(0);

  return (
    <Avatar classNames={{placeholder:"rounded-full"}} size={size} className="uppercase !rounded-full">
      {user?.avatar || user?.user?.avatar ? (
        <img className="rounded-full aspect-square object-cover object-center" src={`${user?.avatar}`} alt={user?.fullName} />
      ) : (
        <span>{userAvatar || "AB"}</span>
      )}
    </Avatar>
  );
};

export default UserAvatar;
