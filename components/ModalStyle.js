import React from "react";
import { Actionsheet } from "native-base";

const ModalStyle = ({ children, title, isOpen, onClose }) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>{children}</Actionsheet.Content>
    </Actionsheet>
  );
};

export default ModalStyle;
