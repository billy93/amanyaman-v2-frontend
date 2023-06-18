import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setFields, listFields } from './systemParamsSlice';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useCreateParamsMutation } from './systemParamsApiSlice';
import {
  useToast,
  Stack,
  Box,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  Text,
  FormControl,
  Input,
  FormLabel,
  Button,
} from '@chakra-ui/react';

const CreateParams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const list = useSelector(listFields);
  const [createParams, { isLoading }] = useCreateParamsMutation();

  const toast = useToast();

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      await createParams(list);
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
