import { Loader } from "@mantine/core";
import React from "react";

const Loading = ({ size, variant = "bars", color = "grape" }) => {
  return <Loader color={color} size={`${size ? size : "xl"}`} variant={`${variant}`} />;
};

export default Loading;
