import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

const GlobalModal = ({ isOpen, onClose, onConfirm, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            ml={3}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GlobalModal;
