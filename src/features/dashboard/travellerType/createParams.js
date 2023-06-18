import React, { useState } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Link,
  Heading,
  Button,
  Image,
  FormControl,
  Input,
  FormLabel,
  useToast,
  InputGroup,
  InputRightElement,
  Select,
  Divider,
  Textarea,
  Center,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setSystemParamsFieldValue,
  setSystemParamsFieldName,
  systemParamsValues,
  systemParamsNames,
  setFields,
  listFields,
} from './systemParamsSlice';
import { differenceInCalendarDays } from 'date-fns';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdAdd } from 'react-icons/md';
import { useCreateParamsMutation } from './systemParamsApiSlice';
import { useGetTravelAgentQuery } from '../travelAgent/travelApiSlice';

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();
  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const CreateParams = () => {
  const dispatch = useDispatch();
  const hiddenInputIdtty = React.useRef(null);
  const navigate = useNavigate();
  const [trigger, setTrigger] = React.useState(false);
  const list = useSelector(listFields);
  const values = useSelector(systemParamsValues);
  const [createParams, { isLoading }] = useCreateParamsMutation();

  const toast = useToast();
  const handleUploadIdentity = (e) => {
    hiddenInputIdtty.current.click();
  };

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      let data = await createParams(list);
      //  dispatch(setListUser([...listProducts, datas]));
      toast({
        title: 'Created User Syestem Parameters',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
        variant: 'solid',
      });
    } catch (err) {
      toast({
        title: `${err?.originalStatus}`,
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
        variant: 'solid',
      });
    }
    setFields(null);
    navigate('/master-data/system-params');
  };

  const handleData = (e) => {
    const data = {
      ...list,
      [e.target.name]: e.target.value,
    };

    dispatch(setFields(data));
  };
  const handleDatas = (e) => {
    dispatch(setSystemParamsFieldValue(e.target.value));
  };

  return (
    <Stack mt={{ base: '1em', md: '5em' }}>
      <Box
        p="12px"
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Box
          as="button"
          onClick={'handleBackStep'}
          display="flex"
          textAlign="left"
        >
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink as={NavLink} to="/master-data/master-user">
                <Text
                  as="b"
                  ml="4"
                  fontSize="sm"
                  color="#065BAA"
                  _hover={{
                    borderBottom: '#065BAA',
                    border: '1 px solid',
                  }}
                >
                  System Parameters
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={NavLink}
                to="#"
                style={{ pointerEvents: 'none' }}
              >
                <Text as={'b'} fontSize={'sm'} color="#231F20">
                  {'Create'}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box minH={{ base: '0', md: '400px' }}>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="name"
                value={list?.name}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                System Parameters Name
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="value"
                value={list?.value}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                System Parameters Value
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          p="9px"
          borderRadius={'5px'}
          border="1px"
          borderColor={'#ebebeb'}
        >
          <Button
            isLoading={isLoading}
            isDisabled={
              list?.name === '' || list?.value === '' || isLoading
                ? true
                : false
            }
            variant={'ClaimBtn'}
            style={{ textTransform: 'uppercase', fontSize: '14px' }}
            fontFamily="arial"
            fontWeight={'700'}
            onClick={handleNext}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
export default CreateParams;
