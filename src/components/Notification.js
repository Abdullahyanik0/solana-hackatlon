import React from "react";
import { showNotification } from "@mantine/notifications";
import { BsCheck2 } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";


export const successNotify = (title, message) => {
  return showNotification({
    title: title,
    message: message,
    color: 'teal',
    icon: <BsCheck2 size={24} />,
  });
};
export const errorNotify = (title, message) => {
  return showNotification({
    title: title,
    message: message,
    color:"red",
    icon: <BiErrorCircle  size={24} />,
  });
};
