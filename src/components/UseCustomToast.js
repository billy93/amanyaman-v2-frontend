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

  return { showErrorToast, showSuccessToast };
};

export default UseCustomToast;
