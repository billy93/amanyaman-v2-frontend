/* eslint-disable indent */
/* eslint-disable react/no-children-prop */
/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Button,
  FormControl,
  Input,
  FormLabel,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  InputGroup,
  InputRightAddon,
  Flex,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { RiErrorWarningLine } from 'react-icons/ri';
import { Select } from 'chakra-react-select';
import { useUpdateProductPriceMutation } from './productPriceApi';
import {
  listAgent,
  formData,
  setFormData,
  listProducts,
} from './productPriceSlice';
import UseCustomToast from '../../../components/UseCustomToast';

import { useGetByIdQuery } from './productPriceApi';

const CreatePrice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetByIdQuery(id);
  const dispatch = useDispatch();
  const list = useSelector(listAgent);
  const listProduct = useSelector(listProducts);
  const form = useSelector(formData);
  const [fields, setFields] = React.useState(null);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const [updateProductPrice, { isLoading: loadingOnSubmit }] =
    useUpdateProductPriceMutation();

  React.useEffect(() => {
    if (data) {
      setFields({
        ...fields,
        id: data?.id,
        npwp: data?.npwp,
        premiumPrice: data?.premiumPrice,
        commisionLv1: data?.commisionLv1,
        commisionLv2: data?.commisionLv2,
        commisionLv3: data?.commisionLv3,
        totalCom: Math.ceil(
          data?.commisionLv1 + data?.commisionLv2 + data?.commisionLv3
        ),
        ppn: data?.ppn,
        pph23: data?.pph23,
      });
    }
  }, [data]);

  React.useEffect(() => {
    refetch(id);
  }, [id, refetch]);
  const handleData = (e) => {
    const newData = {
      ...fields,
      [e.target.name]: e.target.value,
    };

    setFields(newData);
    // dispatch(setFields(newData));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePreiumPrice = (event) => {
    const inputNumber = parseInt(event.target.value, 10);
    const data = {
      ...fields,
      premiumPrice: inputNumber,
    };

    if (!isNaN(inputNumber) && fields?.premiumPrice > 0) {
      setFields(data);
    }
  };

  const handleComm1 = (event) => {
    const inputNumber = parseInt(event.target.value, 10);
    const data = {
      ...fields,
      commisionLv1: inputNumber,
      totalCom: Math.ceil(
        fields?.commisionLv2 + fields?.commisionLv3 + inputNumber
      ),
    };

    if (!isNaN(inputNumber)) {
      setFields(data);
    } else {
      setFields({
        ...fields,
        commisionLv1: 0,
        totalCom: Math.ceil(fields?.commisionLv2 + fields?.commisionLv3 + 0),
      });
    }
  };

  const handleComm2 = (event) => {
    const inputNumber = parseInt(event.target.value, 10);
    const data = {
      ...fields,
      commisionLv2: inputNumber,
      totalCom: Math.ceil(
        fields?.commisionLv1 + fields?.commisionLv3 + inputNumber
      ),
    };

    if (!isNaN(inputNumber)) {
      setFields(data);
    } else {
      setFields({
        ...fields,
        commisionLv2: 0,
        totalCom: Math.ceil(fields?.commisionLv1 + fields?.commisionLv3 + 0),
      });
    }
  };
  const handleComm3 = (event) => {
    const inputNumber = parseInt(event.target.value, 10);
    const data = {
      ...fields,
      commisionLv3: inputNumber,
      totalCom: Math.ceil(
        fields?.commisionLv1 + fields?.commisionLv2 + inputNumber
      ),
    };

    if (!isNaN(inputNumber)) {
      setFields(data);
    } else {
      setFields({
        ...fields,
        commisionLv3: 0,
        totalCom: Math.ceil(fields?.commisionLv1 + fields?.commisionLv2 + 0),
      });
    }
  };
  const handleNext = async () => {
    const data = {
      id: fields?.id,
      npwp: fields?.npwp,
      premiumPrice: fields?.premiumPrice,
      commisionLv1: fields?.commisionLv1,
      commisionLv2: fields?.commisionLv2,
      commisionLv3: fields?.commisionLv3,
      ppn: fields?.ppn,
      pph23: fields?.pph23,
    };
    try {
      const res = await updateProductPrice(data);
      if (res?.data) {
        showSuccessToast('Edit product price successfully!');
        navigate('/master-data/product-price');
      } else {
        const errorMessage = `Fail to edit product price. Status Code: ${res?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (error) {
      const statusCode = error?.response?.status || 'Unknown';
      const errorMessage = `Failed to edit product price. Status Code: ${statusCode}`;
      showErrorToast(errorMessage);
      console.log(error);
    }
  };

  // console.log('total', total);
  console.log('total', fields);
  // console.log('total data', data);
  // const total = React.useMemo(() => {
  //   let tot;

  //   tot = fields?.commisionLv1 + fields.commisionLv2 + fields.commisionLv3;
  //   return tot;
  // }, [fields?.commisionLv1, fields?.commisionLv2, fields?.commisionLv3]);

  const ajiPriceCalc = React.useMemo(() => {
    let tot;
    tot = Math.ceil(
      fields?.premiumPrice -
        (fields?.totalCom * fields?.premiumPrice) / 100 +
        (((fields?.totalCom * fields?.premiumPrice) / 100) * fields?.pph23) /
          100
    );
    return tot;
  }, [fields?.premiumPrice, fields?.pph23, fields?.totalCom]);

  // console.log('total', total);
  console.log('total', fields);
  return (
    <>
      <Box
        p="12px"
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
        mt="5em"
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
              <BreadcrumbLink as={NavLink} to="/master-data/product-price">
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
                  {'Edit Product Price'}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
      <Box m="auto" w="500px">
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          mx="auto"
          gap="10px"
        >
          <Flex
            gridTemplateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(1, 1fr)',
              lg: 'repeat(1, 1fr)',
            }}
            gap="20px"
            w="100%"
          >
            <Box width={{ base: '100%' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
              >
                <Input
                  isDisabled={true}
                  id="inputs"
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  value={data?.productMapping?.productCode}
                  name="productCode"
                  onChange={handleData}
                  textTransform={'uppercase'}
                  h="48px"
                  variant={'custom'}
                  background={
                    data?.productMapping?.productCode !== ''
                      ? '#e8f0fe'
                      : '#ebebeb'
                  }
                />
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    fontStyle:
                      data?.productMapping?.productCode !== ''
                        ? 'italic'
                        : 'normal',
                    fontSize:
                      data?.productMapping?.productCode !== ''
                        ? '12px'
                        : '14px',
                  }}
                >
                  Product Code
                </FormLabel>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
          </Flex>
        </Flex>
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          mx="auto"
          gap="10px"
        >
          <Flex
            gridTemplateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)',
            }}
            w="100%"
            gap="20px"
          >
            <Box width={{ base: '100%', md: '260px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
              >
                <Input
                  id="inputs"
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  value={fields?.premiumPrice}
                  name="productCode"
                  onChange={handlePreiumPrice}
                  textTransform={'uppercase'}
                  h="48px"
                  variant={'custom'}
                  background={
                    fields?.premiumPrice !== '' ? '#e8f0fe' : '#ebebeb'
                  }
                />
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    fontStyle:
                      fields?.premiumPrice !== '' ? 'italic' : 'normal',
                    fontSize: fields?.premiumPrice !== '' ? '12px' : '14px',
                  }}
                >
                  Premium Price
                </FormLabel>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
            <Box width={{ base: '100%', md: '260px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
              >
                <Input
                  id="inputs"
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  value={fields?.commisionLv1}
                  name="travelAgentName"
                  onChange={handleComm1}
                  h="48px"
                  variant={'custom'}
                  background={
                    fields?.commisionLv1 !== '' ? '#e8f0fe' : '#ebebeb'
                  }
                />
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    fontStyle:
                      fields?.commisionLv1 !== '' ? 'italic' : 'normal',
                    fontSize: fields?.commisionLv1 !== '' ? '12px' : '14px',
                  }}
                >
                  Commission Lv1
                </FormLabel>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
          </Flex>
        </Flex>
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          mx="auto"
          gap="10px"
        >
          <Flex
            gridTemplateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)',
            }}
            gap="20px"
            w="100%"
          >
            <Box width={{ base: '100%', md: '260px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
              >
                <Input
                  id="inputs"
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  value={fields?.commisionLv2}
                  name="commisionLv2"
                  onChange={handleComm2}
                  textTransform={'uppercase'}
                  h="48px"
                  variant={'custom'}
                  background={
                    fields?.commisionLv2 !== '' ? '#e8f0fe' : '#ebebeb'
                  }
                />
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    fontStyle:
                      fields?.commisionLv2 !== '' ? 'italic' : 'normal',
                    fontSize: fields?.commisionLv2 !== '' ? '12px' : '14px',
                  }}
                >
                  CommissionLv2
                </FormLabel>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
            <Box width={{ base: '100%', md: '260px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
              >
                <Input
                  id="inputs"
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  value={fields?.commisionLv3}
                  name="commisionLv3"
                  onChange={handleComm3}
                  h="48px"
                  variant={'custom'}
                  background={
                    fields?.commisionLv3 !== '' ? '#e8f0fe' : '#ebebeb'
                  }
                />
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    fontStyle:
                      fields?.commisionLv3 !== '' ? 'italic' : 'normal',
                    fontSize: fields?.commisionLv3 !== '' ? '12px' : '14px',
                  }}
                >
                  Commission Lv3
                </FormLabel>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
          </Flex>
        </Flex>
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          mx="auto"
          gap="10px"
        >
          <Flex
            gridTemplateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(1, 1fr)',
              lg: 'repeat(1, 1fr)',
            }}
            gap="20px"
            w="100%"
          >
            <Box width={{ base: '100%' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
              >
                <Input
                  isDisabled={true}
                  id="inputs"
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  value={data?.travelAgent?.travelAgentName}
                  name="travelAgentName"
                  onChange={handleData}
                  h="48px"
                  variant={'custom'}
                  background={
                    data?.travelAgent?.travelAgentName !== ''
                      ? '#e8f0fe'
                      : '#ebebeb'
                  }
                />
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    fontStyle:
                      data?.travelAgent?.travelAgentName !== ''
                        ? 'italic'
                        : 'normal',
                    fontSize:
                      data?.travelAgent?.travelAgentName !== ''
                        ? '12px'
                        : '14px',
                  }}
                >
                  Travel Agent Name
                </FormLabel>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Box>
        <Flex
          mt="1em"
          width={{ base: '100%' }}
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          justifyContent="center"
          alignItems="center"
          gap="20px"
          flexWrap="wrap"
          mx="auto"
        >
          <Box
            border="1px solid #ebebeb"
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            fontSize="14px"
            fontFamily="Mulish"
          >
            Total Commission
          </Box>
          <Box
            border="1px solid #ebebeb"
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            fontSize="14px"
            fontFamily="Mulish"
          >
            {'Rp '}
            {(Math.ceil(fields?.totalCom * fields?.premiumPrice) / 100).toFixed(
              0
            )}
          </Box>
          <Box
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            border="none"
          >
            <Flex alignItems="center" gap="5px">
              <RiErrorWarningLine size="25px" color="blue" />
              <Box display="flex" flexDirection="column">
                <Text
                  as="b"
                  fontSize="sm"
                  style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                >
                  {' '}
                  Total commission:
                </Text>
                <Text
                  as="p"
                  fontSize="sm"
                  style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                >
                  Calculated from commission level 1, 2 & 3
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Flex
          width={{ base: '100%' }}
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          justifyContent="center"
          alignItems="center"
          gap="20px"
          flexWrap="wrap"
          mx="auto"
        >
          <Box
            border="1px solid #ebebeb"
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            fontSize="14px"
            fontFamily="Mulish"
          >
            After Commision
          </Box>
          <Box
            border="1px solid #ebebeb"
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            fontSize="14px"
            fontFamily="Mulish"
          >
            {'Rp '}
            {Math.ceil(
              fields?.premiumPrice -
                (fields?.totalCom * fields?.premiumPrice) / 100
            ).toFixed(0)}
          </Box>
          <Box
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            border="none"
          >
            <Flex alignItems="center" gap="5px">
              <RiErrorWarningLine size="25px" color="blue" />
              <Box display="flex" flexDirection="column">
                <Text
                  as="b"
                  fontSize="sm"
                  style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                >
                  {' '}
                  After commission price:
                </Text>
                <Text
                  as="p"
                  fontSize="sm"
                  style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                >
                  Premium price - total commission
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Flex
          mt="1em"
          width={{ base: '100%' }}
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          justifyContent="center"
          alignItems="center"
          gap="20px"
          flexWrap="wrap"
          mx="auto"
        >
          <Box
            border="1px solid #ebebeb"
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            fontSize="14px"
            fontFamily="Mulish"
          >
            Ajiprice
          </Box>
          <Box
            border="1px solid #ebebeb"
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            fontSize="14px"
            fontFamily="Mulish"
          >
            {'Rp '}
            {ajiPriceCalc}
          </Box>
          <Box
            p="10px"
            flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
            border="none"
          >
            <Flex alignItems="center" gap="5px">
              <RiErrorWarningLine size="25px" color="blue" />
              <Box display="flex" flexDirection="column">
                <Text
                  as="b"
                  fontSize="sm"
                  style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                >
                  {' '}
                  Ajiprice:
                </Text>
                <Text
                  as="p"
                  fontSize="sm"
                  style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                >
                  Calculated from After commission price + pph23
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        p="9px"
        borderRadius={'5px'}
        border="1px"
        borderColor={'#ebebeb'}
        mt="1em"
      >
        <Button
          variant="ClaimBtn"
          style={{ textTransform: 'uppercase', fontSize: '14px' }}
          fontFamily="arial"
          fontWeight={'700'}
          onClick={handleBack}
        >
          Cancel
        </Button>
        <Button
          isDisabled={
            fields?.commisionLv1 === '' ||
            fields?.commisionLv2 === '' ||
            fields?.commisionLv3 === '' ||
            fields?.premiumPrice === ''
              ? true
              : false
          }
          isLoading={loadingOnSubmit}
          variant={'ClaimBtn'}
          style={{ textTransform: 'uppercase', fontSize: '14px' }}
          fontFamily="arial"
          fontWeight={'700'}
          onClick={handleNext}
        >
          Edit
        </Button>
      </Box>
    </>
  );
};
export default CreatePrice;
