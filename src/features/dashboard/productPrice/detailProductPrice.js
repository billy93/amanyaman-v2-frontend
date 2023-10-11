/* eslint-disable indent */
import React from 'react';
import { useGetByIdQuery } from './productPriceApi';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Center, IconButton } from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import 'react-calendar/dist/Calendar.css';
import { BsFillPencilFill } from 'react-icons/bs';
import CurrencyFormatter from '../../../components/formatCurrency';

const DetailMasterUser = () => {
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetByIdQuery(id, { refetchOnMountOrArgChange: true });
  // const toast = useToast();
  const navigate = useNavigate();

  const handleEditUser = () => {
    navigate(`/master-data/edit-master-product/${id}`, { replace: true });
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (user) {
    content = (
      <Box>
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
            <Box w="100%" pt="15px" pl="0.5em">
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color="gray.500" />}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={handleGoBack}>
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
                      Detail Master Product
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink
                    as={NavLink}
                    to="/master-data/master-product-price"
                  >
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
                      Product Price
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
                      {user !== null ? user?.id : null}
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
                onClick={handleEditUser}
              />
              {/* <IconButton _hover={{color:"white"}} icon={ <CiTrash color="#065BAA" size={'16px'}/>} bg="white" border="1px solid #ebebeb" onClick={handleDeletAgent}/> */}
              {/* <DeleteBtn
                showModalButtonText="Delete"
                modalHeader="Delete Agent"
                modalBody="Confirm delete Agent ?"
              /> */}
            </Box>
          </Box>
        </Box>
        <Box display={'flex'} gap="10px" pl="1em" pr="1em">
          <Box display={'flex'} flexDirection={'column'} mt="1em">
            <Box
              border="1px solid #ebebeb"
              borderRadius={'5px'}
              borderBottom={'none'}
            >
              <Box
                bg="#ebebeb"
                w={{ base: '100%', md: '386px' }}
                p={{ base: '5px', md: '9px' }}
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                <Heading
                  as="h4"
                  variant={'primary'}
                  fontFamily={'Mulish'}
                  style={{ fontSize: '17px' }}
                  color={'#231F20'}
                >
                  {user !== null ? user?.id : null}{' '}
                </Heading>
              </Box>
              <Box
                bg="white"
                w={{ base: '100%', md: '386px' }}
                p={{ md: '10px' }}
              >
                <Box
                  pb="15px"
                  pt="14px"
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
                    {'Travel Agent Name'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    fontWeight={'400'}
                  >
                    {user !== null ? user?.travelAgent?.travelAgentName : null}
                  </Text>
                </Box>
                <Box
                  pb="15px"
                  pt="14px"
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
                    {'Select Product'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {user !== null ? user?.productMapping?.productName : null}
                  </Text>
                </Box>
                <Box
                  pt="15px"
                  pb="14px"
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
                    {'NPWP Status'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {user !== null && user && user?.npwp === false
                      ? 'Not Available'
                      : 'Available'}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box w="100%">
            <Box
              bg="white"
              mt="18px"
              p="10px"
              border="1px solid #ebebeb"
              borderRadius={'5px'}
            >
              <Text
                as="b"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
                color={'#231F20'}
              >
                Price Details
              </Text>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '6px 9px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Premium price
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? (
                    <CurrencyFormatter amount={user.premiumPrice} />
                  ) : (
                    '-'
                  )}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '6px 9px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Commission Level 1
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.commisionLv1 : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Commission Level 2
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.commisionLv2 : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '6px 9px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Commission Level 3
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.commisionLv3 : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '6px 9px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Total Commission
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? <CurrencyFormatter amount={user.ajiPrice} /> : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '6px 9px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Nett to Agent Price
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? (
                    <CurrencyFormatter amount={user.afterCommisionPrice} />
                  ) : (
                    '-'
                  )}
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
