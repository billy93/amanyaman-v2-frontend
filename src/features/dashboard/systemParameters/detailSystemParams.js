import React from 'react';
import {
  useGetSystemParamsQuery,
  useDeleteParamsMutation,
} from './systemParamsApiSlice';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { setDetail, detailParams } from './systemParamsSlice';
import {
  Box,
  Heading,
  Text,
  Center,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import 'react-calendar/dist/Calendar.css';
import { BsFillPencilFill } from 'react-icons/bs';
import { CiTrash } from 'react-icons/ci';

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

const DetailMasterUser = () => {
  // const currentstep = useSelector()
  const dispatch = useDispatch();
  const { id } = useParams();
  const detail = useSelector(detailParams);
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteParams] = useDeleteParamsMutation();

  const {
    data: { response: systemParams } = {},
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSystemParamsQuery({ refetchOnMountOrArgChange: true });
  const prev = usePrevious(systemParams);
  React.useEffect(() => {
    if (
      systemParams != null &&
      JSON.stringify(prev) !== JSON.stringify(systemParams)
    ) {
      let data = systemParams?.filter((param) => param.id === parseInt(id));
      dispatch(setDetail(data));
    }
  }, [prev, systemParams, id, dispatch]);

  const handleEdit = (e) => {
    e.preventDefault();
    // dispatch(setEdit(detail))
    navigate(`/master-data/edit-system-params/${id}`);
  };
  const handleDeletParams = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteParams(parseInt(id));
      const idx = 'deleteparams';
      if (res) {
        if (!toast.isActive(idx)) {
          toast({
            id: 'deleteparams',
            title: 'Delete Success',
            status: 'success',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
            variant: 'solid',
          });
        }
        navigate('/master-data/system-params');
      }
    } catch (err) {
      toast({
        id: 'deleteparams',
        title: `${err?.originalStatus}`,
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
        variant: 'solid',
      });
    }
  };
  //   const handleEditUser = (e) => {
  //     e.preventDefault()
  //     const datas = {
  //           id:detail !==null ? detail[0].id : null,
  //           login:detail !==null ? detail[0].login : null,
  //           firstName:detail !==null ? detail[0].firstName : null,
  //           lastName:detail !==null ? detail[0].lastName : null,
  //           email:detail !==null ? detail[0].email : null,
  //           authorities:[`${detail !==null ? detail[0].authorities[0] : ''}`]
  //         }
  //     dispatch(setFormUser(datas))
  //     navigate(`/master-data/edit-user/${id}`)
  // }

  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (isSuccess) {
    content = (
      <Box pl="2em" pr="2em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt={{ base: '4em', md: '4em' }}
        >
          <Box
            display="flex"
            justifyContent={'space-between'}
            w="100%"
            borderBottom="1px"
            borderColor={'#ebebeb'}
          >
            <Box w="100%" pt="15px">
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
                      {detail !== null ? detail[0].id : null}
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>
            <Box display={'flex'} alignItems={'center'} gap="5px">
              <IconButton
                _hover={{ color: 'white' }}
                icon={<BsFillPencilFill color="#065BAA" size={'16px'} />}
                bg="white"
                border="1px solid #ebebeb"
                onClick={handleEdit}
              />
              <IconButton
                _hover={{ color: 'white' }}
                icon={<CiTrash color="#065BAA" size={'16px'} />}
                bg="white"
                border="1px solid #ebebeb"
                onClick={handleDeletParams}
              />
            </Box>
          </Box>
        </Box>
        <Box display={'flex'} w={'100%'}>
          <Box display={'flex'} flexDirection={'column'} w={'100%'}>
            <Box
              bg="#F0F3F8"
              w={{ base: '100%', md: '100%' }}
              p={{ base: '5px', md: '1em' }}
            >
              <Heading
                as="h6"
                variant={'primary'}
                fontFamily={'Mulish'}
                style={{ fontSize: '16px' }}
                color={'#231F20'}
              >
                {detail !== null ? detail[0].id : null}
              </Heading>
            </Box>
            <Box
              bg="white"
              w={{ base: '100%', md: '100%' }}
              p={{ base: '5px', md: '1em' }}
            >
              <Box
                pb="10px"
                borderBottom={'1px solid #ebebeb'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                justifyContent={'center'}
              >
                <Text
                  as="b"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'Name'}
                </Text>
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {detail !== null ? detail[0].name : null}
                </Text>
              </Box>
              <Box
                pb="10px"
                pt="10px"
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                justifyContent={'center'}
              >
                <Text
                  as="b"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'Value'}
                </Text>
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {detail !== null ? detail[0].value : null}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default DetailMasterUser;
