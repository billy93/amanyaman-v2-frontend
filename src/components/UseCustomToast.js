// useCustomToast.js
import { useToast } from '@chakra-ui/react';

const UseCustomToast = () => {
  const toast = useToast();

  const showErrorToast = (message) => {
    toast({
      title: 'Error',
      position: 'top-right',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const showSuccessToast = (message) => {
    toast({
      title: 'Success',
      position: 'top-right',
      description: message,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return { showErrorToast, showSuccessToast };
};

export default UseCustomToast;
