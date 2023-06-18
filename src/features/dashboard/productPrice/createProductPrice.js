/* eslint-disable react/no-children-prop */
/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { RiErrorWarningLine } from 'react-icons/ri';
import { Select } from 'chakra-react-select';
import {
  listAgent,
  formData,
  setFormData,
  listProducts,
} from './productPriceSlice';

const CreatePrice = () => {
  const dispatch = useDispatch();
  const list = useSelector(listAgent);
  const listProduct = useSelector(listProducts);
  const form = useSelector(formData);

  function handleSelectAgent(data) {
    console.log('data', data);
    const newData = {
      ...form,
      travelAgentName: { ...data },
    };
    dispatch(setFormData(newData));
  }
  function handleSelectProduct(data) {
    console.log('data', data);
    const newData = {
      ...form,
      productName: { ...data },
    };
    dispatch(setFormData(newData));
  }
  const handleData = (e) => {
    const newData = {
      ...form,
      [e.target.name]: e.target.value,
    };

    dispatch(setFormData(newData));
  };
  const total = React.useMemo(() => {
    let tot;
    tot =
      parseInt(form?.commissionlvl1) +
      parseInt(form?.commissionlvl2) +
      parseInt(form?.commissionlvl3);
    return tot;
  }, [form?.commissionlvl1, form?.commissionlvl2, form?.commissionlvl3]);

  const ppnDeduction = React.useMemo(() => {
    let tot;
    tot =
      parseInt(form?.commissionlvl1) +
      parseInt(form?.commissionlvl2) +
      parseInt(form?.commissionlvl3);
    return tot;
  }, [form?.commissionlvl1, form?.commissionlvl2, form?.commissionlvl3]);

  const displayPercent = (percent, fallback, digits = 2) =>
    percent === null || percent === undefined
      ? fallback
      : `${(percent * 100).toFixed(digits)}%`;

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
                  {'Create Price'}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <Box display={'flex'} gap="10px">
              <Box>
                <FormControl
                  variant="floating"
                  isRequired
                  fontFamily={'Mulish'}
                  mt="14px"
                >
                  <Box className="floating-form">
                    <Box className="react-select-container">
                      <Select
                        bg="blue"
                        color="white"
                        isMulti={false}
                        name="colors"
                        onChange={handleSelectAgent}
                        value={form?.travelAgentName}
                        classNamePrefix="chakra-react-select"
                        options={list}
                        closeMenuOnSelect={true}
                        chakraStyles={{
                          dropdownIndicator: (
                            prev,
                            { selectProps: { menuIsOpen } }
                          ) => ({
                            ...prev,
                            '> svg': {
                              transitionDuration: 'normal',
                              transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                            },
                          }),
                        }}
                      />
                      <span className="highlight"></span>
                      <FormLabel
                        pt="1.5"
                        style={{
                          transform:
                            form !== null && form?.travelAgentName !== null
                              ? 'translate(0, -10px) scale(0.75)'
                              : 'translate(0, 4px) scale(0.75)',
                          color:
                            form !== null && form?.travelAgentName !== null
                              ? '#065baa'
                              : '#231F20',
                          fontSize: '14px',
                        }}
                        fontFamily={'Mulish'}
                      >
                        TravelAgent
                      </FormLabel>
                    </Box>
                  </Box>
                  {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
              </Box>
              <Box>
                <FormControl
                  variant="floating"
                  isRequired
                  fontFamily={'Mulish'}
                  mt="14px"
                >
                  <Box className="floating-form">
                    <Box className="react-select-container">
                      <Select
                        isMulti={false}
                        name="colors"
                        onChange={handleSelectProduct}
                        value={form?.productName}
                        classNamePrefix="chakra-react-select"
                        options={listProduct}
                        closeMenuOnSelect={true}
                        chakraStyles={{
                          dropdownIndicator: (
                            prev,
                            { selectProps: { menuIsOpen } }
                          ) => ({
                            ...prev,
                            '> svg': {
                              transitionDuration: 'normal',
                              transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                            },
                          }),
                        }}
                      />
                      <span className="highlight"></span>
                      <FormLabel
                        pt="1.5"
                        style={{
                          transform:
                            form !== null && form?.productName !== null
                              ? 'translate(0, -10px) scale(0.75)'
                              : 'translate(0, 4px) scale(0.75)',
                          color:
                            form !== null && form?.productName !== null
                              ? '#065baa'
                              : '#231F20',
                          fontSize: '14px',
                        }}
                        fontFamily={'Mulish'}
                      >
                        Product
                      </FormLabel>
                    </Box>
                  </Box>
                  {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
              </Box>
            </Box>
            <Box width={{ base: '100%', md: '320px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Input
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  name="premiumPrice"
                  value={form?.premiumPrice}
                  onChange={handleData}
                  h="48px"
                  variant={'custom'}
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  zIndex={'0'}
                  style={{
                    zIndex: 0,
                    color:
                      form !== null && form?.premiumPrice !== ''
                        ? '#065baa'
                        : '#171923',
                    fontWeight: 'normal',
                    paddingBottom: '4px',
                  }}
                >
                  Premium Price
                </FormLabel>
                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
            <Box width={{ base: '100%', md: '320px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Stack>
                  <InputGroup size="sm">
                    <Input
                      type="number"
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      name="commissionlvl1"
                      value={form?.commissionlvl1}
                      onChange={handleData}
                      h="48px"
                      variant={'custom'}
                    />
                    <InputRightAddon children="%" h="48px" />
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      style={{
                        transform:
                          form?.commissionlvl1 !== ''
                            ? 'translate(-3px, -8px) scale(0.75)'
                            : 'translate(0px, 2px) scale(0.75)',
                        fontSize: '14px',
                        background: 'transparent',
                        color:
                          form !== null && form?.commissionlvl1 !== ''
                            ? '#065baa'
                            : '#171923',
                        zIndex: '0',
                        fontWeight: 'normal',
                      }}
                    >
                      Commission Level 1
                    </FormLabel>
                  </InputGroup>
                </Stack>
              </FormControl>
            </Box>
            <Box width={{ base: '100%', md: '320px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Stack>
                  <InputGroup size="sm">
                    <Input
                      type="number"
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      name="commissionlvl2"
                      value={form?.commissionlvl2}
                      onChange={handleData}
                      h="48px"
                      variant={'custom'}
                    />
                    <InputRightAddon children="%" h="48px" />
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      style={{
                        transform:
                          form?.commissionlvl2 !== ''
                            ? 'translate(-3px, -8px) scale(0.75)'
                            : 'translate(0px, 2px) scale(0.75)',
                        fontSize: '14px',
                        background: 'transparent',
                        color:
                          form?.commissionlvl2 !== '' ? '#065baa' : '#171923',
                        zIndex: '0',
                        fontWeight: 'normal',
                      }}
                    >
                      Commission Level 2
                    </FormLabel>
                    {/* <FormLabel fontSize="12" pt="1.5">Commission Level 2</FormLabel> */}
                  </InputGroup>
                </Stack>
                {/* <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="commissionlvl2" value={form?.commissionlvl2} onChange={handleData} h="48px" variant={'custom'}/> */}
                {/* It is important that the Label comes after the Control due to css selectors */}

                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
            <Box width={{ base: '100%', md: '320px' }} mb="10px">
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Stack>
                  <InputGroup size="sm">
                    <Input
                      type="number"
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      name="commissionlvl3"
                      value={form?.commissionlvl3}
                      onChange={handleData}
                      h="48px"
                      variant={'custom'}
                    />
                    <InputRightAddon children="%" h="48px" />
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      style={{
                        transform:
                          form?.commissionlvl3 !== ''
                            ? 'translate(-3px, -8px) scale(0.75)'
                            : 'translate(0px, 2px) scale(0.75)',
                        fontSize: '14px',
                        background: 'transparent',
                        color:
                          form?.commissionlvl3 !== '' ? '#065baa' : '#171923',
                        zIndex: '0',
                        fontWeight: 'normal',
                      }}
                    >
                      Commission Level 3
                    </FormLabel>
                    {/* <FormLabel fontSize="12" pt="1.5">Commission Level 3</FormLabel> */}
                  </InputGroup>
                </Stack>

                {/* It is important that the Label comes after the Control due to css selectors */}

                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
          </Box>
          <Box
            width={{ base: '100%', md: '1217px' }}
            display={'flex'}
            justifyContent={'center'}
            gap="20px"
            alignItems={'center'}
          >
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              Total Commision
            </Box>
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              {'Rp '}
              {(Math.ceil(total * form?.premiumPrice) / 100).toFixed(0)}
            </Box>
            <Box style={{ border: 'none' }} p="10px" w="320px">
              <Box display="flex" alignItems={'center'} gap="5px">
                <RiErrorWarningLine size={'25px'} color="blue" />
                <Box display={'flex'} flexDirection={'column'}>
                  <Text
                    as="b"
                    fontSize={'sm'}
                    style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                  >
                    {' '}
                    Total commission:
                  </Text>
                  <Text
                    as="p"
                    fontSize={'sm'}
                    style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                  >
                    Calculated from commission level 1, 2 & 3
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            width={{ base: '100%', md: '1217px' }}
            display={'flex'}
            justifyContent={'center'}
            gap="20px"
            alignItems={'center'}
          >
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              After Commission Price
            </Box>
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              {'Rp '}
              {parseInt(form?.premiumPrice) -
                (Math.ceil(total * form?.premiumPrice) / 100).toFixed(0)}
            </Box>
            <Box style={{ border: 'none' }} p="10px" w="320px">
              <Box display="flex" alignItems={'center'} gap="5px">
                <RiErrorWarningLine size={'25px'} color="blue" />
                <Box display={'flex'} flexDirection={'column'}>
                  <Text
                    as="b"
                    fontSize={'sm'}
                    style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                  >
                    After commission price:
                  </Text>
                  <Text
                    as="p"
                    fontSize={'sm'}
                    style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                  >
                    Premium price - total commission
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            width={{ base: '100%', md: '540px' }}
            m="auto"
            mb="15px"
            mt="10px"
          >
            <Box width={{ base: '100%', md: '320px' }}>
              <FormControl variant="floating" id="first-name" isRequired>
                <InputGroup>
                  <Input
                    placeholder=" "
                    _placeholder={{ opacity: 1, color: 'gray.500' }}
                    name="ppn"
                    value={form?.ppn}
                    onChange={handleData}
                    h="48px"
                    variant={'custom'}
                  />
                  {/* It is important that the Label comes after the Control due to css selectors */}
                  <FormLabel
                    fontSize="12"
                    pt="1.5"
                    style={{
                      transform:
                        form?.ppn !== ''
                          ? 'translate(-3px, -8px) scale(0.75)'
                          : 'translate(0px, 2px) scale(0.75)',
                      fontSize: '14px',
                      background: 'transparent',
                      color: form?.ppn !== '' ? '#065baa' : '#171923',
                      zIndex: '0',
                      fontWeight: 'normal',
                    }}
                  >
                    PPN
                  </FormLabel>
                  <InputRightAddon children="%" h="48px" />
                </InputGroup>
                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <Box width={{ base: '100%', md: '320px' }}>
              <FormControl variant="floating" id="first-name" isRequired>
                <InputGroup>
                  <Input
                    placeholder=" "
                    _placeholder={{ opacity: 1, color: 'gray.500' }}
                    name="ppn"
                    value={form?.pph23}
                    onChange={handleData}
                    h="48px"
                    variant={'custom'}
                  />
                  {/* It is important that the Label comes after the Control due to css selectors */}
                  <FormLabel
                    fontSize="12"
                    pt="1.5"
                    style={{
                      transform:
                        form?.pph23 !== ''
                          ? 'translate(-3px, -8px) scale(0.75)'
                          : 'translate(0px, 2px) scale(0.75)',
                      fontSize: '14px',
                      background: 'transparent',
                      color: form?.pph23 !== '' ? '#065baa' : '#171923',
                      zIndex: '0',
                      fontWeight: 'normal',
                    }}
                  >
                    PPH23
                  </FormLabel>
                  <InputRightAddon children="%" h="48px" />
                </InputGroup>

                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
          </Box>
          <Box
            width={{ base: '100%', md: '1139px' }}
            display={'flex'}
            justifyContent={'center'}
            gap="20px"
            alignItems={'center'}
            mt="15px"
          >
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              PPH 23 Value
            </Box>
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              RP. 5000
            </Box>
            <Box style={{ border: 'none' }} p="10px" w="240px">
              <Box display="flex" alignItems={'center'} gap="5px">
                {/* <RiErrorWarningLine size={'20px'} color="blue" /> */}
                <Box display={'flex'} flexDirection={'column'}>
                  {/* <Text as="b" fontSize={'sm'} style={{fontSize:"12px",fontFamily:'Mulish'}}>After commission price:</Text> */}
                  <Text
                    as="p"
                    fontSize={'sm'}
                    style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                  >
                    {/* Premium price - total commission             */}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            width={{ base: '100%', md: '1222px' }}
            display={'flex'}
            justifyContent={'center'}
            gap="20px"
            alignItems={'center'}
          >
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              AJI Price
            </Box>
            <Box
              border="1px solid #ebebeb"
              p="10px"
              w="320px"
              style={{ fontSize: '14px', fontFamily: 'Mulish' }}
            >
              RP. 35000
            </Box>
            <Box style={{ border: 'none' }} p="10px" w="320px">
              <Box display="flex" alignItems={'center'} gap="5px">
                <RiErrorWarningLine size={'25px'} color="blue" />
                <Box display={'flex'} flexDirection={'column'}>
                  <Text
                    as="b"
                    fontSize={'sm'}
                    style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                  >
                    AJI Price:
                  </Text>
                  <Text
                    as="p"
                    fontSize={'sm'}
                    style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                  >
                    After commission price - PPN value + PPH 23 value
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        p="1em"
      >
        <Button variant={'custom'} size="sm">
          {' '}
          ADD
        </Button>
      </Box>
    </>
  );
};
export default CreatePrice;
