import { Loader } from "@mantine/core";
import React from "react";

export const Loading = ({ size, variant = "bars", color = "grape" }) => {
  return <Loader color={color} size={`${size ? size : "xl"}`} variant={`${variant}`} />;
};

