// useCustomToast.js
import { useToast } from '@chakra-ui/react';

const UseCustomToast = () => {
  const toast = useToast();

  const showErrorToast = (message, id) => {
    toast({
      id: id,
      title: 'Error',
      position: 'top-right',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      allowDuplicate: false,
    });
  };

  const showSuccessToast = (message, id) => {
    toast({
      id: id,
      title: 'Success',
      position: 'top-right',
      description: message,
      status: 'success',
      duration: 5000,
      isClosable: true,
      allowDuplicate: false,
    });
  };
  const showWarningToast = (message, id) => {
    toast({
      id: id,
      title: 'Warning',
      position: 'top-right',
      description: message,
      status: 'warning',
      duration: 5000,
      isClosable: true,
      allowDuplicate: false,
    });
  };

  return { showErrorToast, showSuccessToast, showWarningToast };
};

export default UseCustomToast;
