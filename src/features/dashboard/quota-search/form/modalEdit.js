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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Traveller</ModalHeader>
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
            EDIT
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GlobalModal;
