import React from "react";
import { Text } from "native-base";

const TextTitleStyle = ({ children, style }) => {
  return (
    <Text
      color="gray.500"
      fontSize="md"
      style={[style, { fontFamily: "myFont" }]}
    >
      {children}
    </Text>
  );
};

export default TextTitleStyle;
