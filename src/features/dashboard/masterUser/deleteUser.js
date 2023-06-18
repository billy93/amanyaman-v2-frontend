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
import { useDeleteUserMutation } from './userApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';
import UseCustomToast from '../../../components/UseCustomToast';

const CustomModalDelete = ({ showModalButtonText, modalHeader, modalBody }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showErrorToast, showSuccessToast } = UseCustomToast;
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [
    deleteUser,
    { isLoading: onLoading, isSuccess: onSuccess, isError: onError },
  ] = useDeleteUserMutation();

  const handleDelete = React.useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await deleteUser(parseInt(id));
        const idx = 'deleteuser';
        if (res) {
          if (!toast.isActive(idx)) {
            toast({
              id: 'deleteuser',
              title: 'Delete Success',
              status: 'success',
              position: 'top-right',
              duration: 3000,
              isClosable: true,
              variant: 'solid',
            });
          }
          navigate('/master-data/master-user');
        }
      } catch (err) {
        toast({
          id: 'deleteuser',
          title: `${err?.originalStatus}`,
          status: 'success',
          position: 'top-right',
          duration: 3000,
          isClosable: true,
          variant: 'solid',
        });
      }
    },
    [deleteUser, id, navigate, toast]
  );

  React.useEffect(() => {
    if (onSuccess) {
      showSuccessToast('Delete Success');
    }
  }, [onSuccess, handleDelete, showSuccessToast]);

  React.useEffect(() => {
    if (onError) {
      showErrorToast('Delete Failed');
    }
  }, [onError, handleDelete, showErrorToast]);

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
