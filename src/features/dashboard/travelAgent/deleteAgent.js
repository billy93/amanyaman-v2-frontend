import React from 'react';
import {
  IconButton,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { useDeleteAgentMutation } from './travelApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';

const CustomModalDelete = ({ showModalButtonText, modalHeader, modalBody }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteAgent, { isLoading: onLoading }] = useDeleteAgentMutation();
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteAgent(parseInt(id));
      const idx = 'deleteagent';
      if (res) {
        if (!toast.isActive(idx)) {
          toast({
            id: 'deleteagent',
            title: 'Delete Success',
            status: 'success',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
            variant: 'solid',
          });
        }
        navigate('/master-data/travel-agent');
      }
    } catch (err) {
      toast({
        id: 'deleteagent',
        title: `${err?.originalStatus}`,
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
        variant: 'solid',
      });
    }
  };
  return (
    <>
      <IconButton
        _hover={{ color: 'white' }}
        icon={<CiTrash color="#065BAA" size={'16px'} />}
        bg="white"
        border="1px solid #ebebeb"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleDelete} isLoading={onLoading}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModalDelete;
