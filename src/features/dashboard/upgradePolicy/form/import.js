import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Input,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';
import { setMessage } from '../upgradeQuotaSearchSlice';
import { MdLogin } from 'react-icons/md';
import { useImportFileMutation } from '../policyApiSlice';
import DownloadBtn from './download';
import UseCustomToast from '../../../../components/UseCustomToast';
import { useParams } from 'react-router-dom';

const CustomModal = ({ showModalButtonText, modalHeader, modalBody }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const dispatch = useDispatch();
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [toastId, setToastId] = React.useState(null);
  const [filesUpload, setFilesUpload] = React.useState(null);
  const [
    importFile,
    { isLoading: loading, isSuccess: success, isError: errorUpload },
  ] = useImportFileMutation({
    skip: true,
  });

  const handleFileChange = (e) => {
    if (e.target.files) {
      console.log('filess', e.target.files[0]);
      setFilesUpload(e.target.files[0]);
      // dispatch(setUploadFile({csvfile:e.target.files[0]}))
    }
  };

  console.log('id', id);
  const handleImport = async (e) => {
    e.preventDefault();
    try {
      const response = await importFile({ filesUpload, id }).unwrap();
      console.log('response import', response);
    } catch (err) {
      console.log('err');
    }
  };

  React.useEffect(() => {
    if (success) {
      dispatch(setMessage(true));
    }
  }, [success, dispatch]);

  React.useEffect(() => {
    let timeoutId;

    if (success) {
      // Clear any existing timeout
      clearTimeout(timeoutId);

      // Set a new timeout to delay showing the toast
      timeoutId = setTimeout(() => {
        const newToastId = showSuccessToast(
          'Upload File successfully!',
          'successuploaduser'
        );
        setToastId(newToastId);
        onClose();
        setToastId(null);
        setFilesUpload(null);
      }, 500); // Adjust the delay time as needed

      // Cleanup function to clear the timeout if component unmounts or success state changes
      return () => {
        clearTimeout(timeoutId);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);
  // console.log('filesUpload', filesUpload)
  React.useEffect(() => {
    let timeoutId;

    if (errorUpload) {
      // Clear any existing timeout
      clearTimeout(timeoutId);

      // Set a new timeout to delay showing the toast
      timeoutId = setTimeout(() => {
        const newToastId = showErrorToast(
          'Upload File fail!',
          'failuploaduser'
        );
        setToastId(newToastId);
        onClose();
        setToastId(null);
        setFilesUpload(null);
      }, 500); // Adjust the delay time as needed

      // Cleanup function to clear the timeout if component unmounts or success state changes
      return () => {
        clearTimeout(timeoutId);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorUpload]);

  return (
    <>
      <Button
        leftIcon={<MdLogin />}
        colorScheme="#231F20"
        variant="outline"
        size={'sm'}
        color="#231F20"
        onClick={onOpen}
      >
        {showModalButtonText}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>{modalHeader}</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            p="1em"
          >
            <Input type="file" onChange={handleFileChange} />
          </Box>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            {/* <Button variant="ghost" mr={3} onClick={() => refetch()}>
              refetch
            </Button> */}
            <DownloadBtn />
            <Button
              onClick={handleImport}
              isLoading={loading}
              isDisabled={filesUpload === null ? true : false}
            >
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
