import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Button,
  FormControl,
  Input,
  FormLabel,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setSystemParamsFieldValue,
  systemParamsValues,
  listFields,
  editParams,
  setEdit,
} from './systemParamsSlice';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  useGetSystemParamsQuery,
  useUpdateParamsMutation,
} from './systemParamsApiSlice';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const editParam = useSelector(editParams);
  const [updateParams, { isLoading }] = useUpdateParamsMutation();

  const { data: systemParams } = useGetSystemParamsQuery({
    refetchOnMountOrArgChange: true,
  });
  const prev = usePrevious(systemParams);
  React.useEffect(() => {
    if (
      systemParams != null &&
      JSON.stringify(prev) !== JSON.stringify(systemParams)
    ) {
      let data = systemParams?.filter((param) => param.id === parseInt(id));
      dispatch(setEdit(data[0]));
    }
  }, [prev, systemParams, id, dispatch]);

  const toast = useToast();

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      await updateParams(editParam);
      //  dispatch(setListUser([...listProducts, datas]));
      toast({
        title: 'Update Syestem Parameters',
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
    setEdit(null);
    navigate('/master-data/system-params');
  };

  const handleData = (e) => {
    const data = {
      ...editParam,
      [e.target.name]: e.target.value,
    };

    dispatch(setEdit(data));
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
                  {'Edit'}
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
                value={editParam?.name}
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
                value={editParam?.value}
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
              editParam?.name === '' || editParam?.value === '' || isLoading
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
