import React, { useRef } from "react";
import { Button, AlertDialog } from "native-base";

const AlertDialogStyle = ({
  isOpen,
  setIsOpen,
  onButtonActionPres,
  title,
  description,
  buttonTitleCancle,
  buttonTitleAction,
}) => {
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{title}</AlertDialog.Header>
        <AlertDialog.Body>{description}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onClose}
              ref={cancelRef}
            >
              {buttonTitleCancle}
            </Button>
            <Button
              colorScheme="danger"
              onPress={() => {
                onClose();
                onButtonActionPres();
              }}
            >
              {buttonTitleAction}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default AlertDialogStyle;
