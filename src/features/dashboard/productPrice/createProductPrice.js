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
  const { data, isLoading } = useGetByIdQuery(id);
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
        ppn: data?.ppn,
        pph23: data?.pph23,
      });
    }
  }, [data]);

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

  const handleNext = async () => {
    try {
      const res = await updateProductPrice(fields);
      if (res?.data) {
        showSuccessToast('Plan Types created successfully!');
        navigate('/master-data/product-price');
      } else {
        const errorMessage = `Failed to create plan types. Status Code: ${res?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (error) {
      const statusCode = error?.response?.status || 'Unknown';
      const errorMessage = `Failed to create Plan Types. Status Code: ${statusCode}`;
      showErrorToast(errorMessage);
      console.log(error);
    }
  };
  console.log('fields data', data);
  console.log('fields data', fields);
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
                  {'Create Product Price'}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
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
                style={{ fontSize: '14px' }}
              >
                Product Code
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
                style={{ fontSize: '14px' }}
              >
                Travel Agent Name
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
                value={data?.premiumPrice}
                name="productCode"
                onChange={handleData}
                textTransform={'uppercase'}
                h="48px"
                variant={'custom'}
                background={fields?.premiumPrice !== '' ? '#e8f0fe' : '#ebebeb'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
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
                onChange={handleData}
                h="48px"
                variant={'custom'}
                background={fields?.commisionLv1 !== '' ? '#e8f0fe' : '#ebebeb'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
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
                onChange={handleData}
                textTransform={'uppercase'}
                h="48px"
                variant={'custom'}
                background={fields?.commisionLv2 !== '' ? '#e8f0fe' : '#ebebeb'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
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
                onChange={handleData}
                h="48px"
                variant={'custom'}
                background={fields?.commisionLv3 !== '' ? '#e8f0fe' : '#ebebeb'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Commission Lv3
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
        </Flex>
      </Flex>
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
