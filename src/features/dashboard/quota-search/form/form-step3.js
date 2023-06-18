/* eslint-disable react/no-children-prop */
/* eslint-disable indent */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FillTravellersData,
  setTravellersData,
  selectManualInput,
  selectedTravelInsurance,
} from '../quotaSearchSlice';
import {
  RadioGroup,
  Radio,
  Textarea,
  Stack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Image,
  Flex,
  IconButton,
  InputRightElement,
  InputGroup,
  Heading,
  Input,
  useDisclosure,
  useToast,
  Box,
  Button,
  FormControl,
  FormLabel,
  ButtonGroup,
} from '@chakra-ui/react';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl';
import Umbrella from '../../../../img/Umbrella.png';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MdCreate } from 'react-icons/md';

const Form3 = ({
  label,
  hasCompletedAllSteps,
  activeStep,
  reset,
  prevStep,
  nextStep,
  isLastStep,
}) => {
  const initStateTraveller = useSelector(selectManualInput);
  const selectedInsurance = useSelector(selectedTravelInsurance);
  const listTravellers = useSelector(FillTravellersData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [type, setType] = useState('Adult');
  const [typeStatus, setTypeStatus] = useState('Mr');
  const [select, setSelect] = useState('new');
  const [isActiveSelectCountry, setActiveSelectCountry] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isActiveNew, setIsActiveNew] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState('');
  const [pasportNumber, setPasportNumber] = useState('');
  const [searchTraveller, setSearchTraveller] = useState('');
  const [dateBirth, setDateBirth] = useState('');
  const toast = useToast();

  // const handleUserChange = (e) => {};
  const setPhoneNumbers = (e) => {
    setPhoneNumber(e.target.value);
  };
  const setAddresss = (e) => {
    setAddress(e.target.value);
  };
  const setEmailAddress = (e) => {
    setEmail(e.target.value);
  };
  const setSearchTravellers = (e) => {
    setSearchTraveller(e.target.value);
  };
  const handleEditTravellersData = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-vars
    const data = {
      step: 1,
    };
    // dispatch((data))
  };

  const setFirstNames = (e) => {
    setFirstName(e.target.value);
  };
  const setLastNames = (e) => {
    setLastName(e.target.value);
  };
  const setPasportNumbers = (e) => {
    setPasportNumber(e.target.value);
  };
  const handleSelectType = (e) => {
    const text = e.target.value;
    setType(text);

    if (text !== '') {
      setActiveSelectCountry(true);
    } else {
      setActiveSelectCountry(false);
    }
  };
  const handleSelectTypeStatus = (e) => {
    const text = e.target.value;
    setTypeStatus(text);
  };
  const onSelect = (selected) => {
    setSelect(selected);
  };
  const setPlaceOfBirths = (e) => {
    setPlaceOfBirth(e.target.value);
  };
  const selectDate = (date) => {
    setDateOfBirth(date);
    if (date !== null) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };
  const selectDateNew = (date) => {
    setDateBirth(date);
    if (date !== null) {
      setIsActiveNew(true);
    } else {
      setIsActiveNew(false);
    }
  };
  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });

    return formatter.format(date);
  }

  const formatInputValue = () => {
    if (!dateOfBirth) return '';
    return `${dateOfBirth?.day} ${getMonthName(dateOfBirth?.month)} ${
      dateOfBirth?.year
    }`;
  };
  const formatInputValues = () => {
    if (!dateBirth) return '';
    return `${dateBirth?.day} ${getMonthName(dateBirth?.month)} ${
      dateBirth?.year
    }`;
  };
  const renderCustomInput = ({ ref }) => (
    <>
      <FormControl
        variant="floating"
        id="first-name"
        isRequired
        fontFamily={'Mulish'}
      >
        <InputGroup id="float-labelss">
          <Input
            readOnly
            ref={ref}
            placeholder=" "
            _placeholder={{ opacity: 1, color: 'gray.500' }}
            value={
              dateOfBirth
                ? `${dateOfBirth?.day} ${getMonthName(dateOfBirth?.month)} ${
                    dateOfBirth?.year
                  }`
                : ''
            }
            h="48px"
          />
          <InputRightElement children={<SlCalender color="green.500" />} />
          <FormLabel
            fontSize="12"
            pt="1.5"
            className={isActive || dateOfBirth ? 'Actives' : ''}
            fontFamily={'Mulish'}
          >
            Date Of Birth
          </FormLabel>
        </InputGroup>
        {/* It is important that the Label comes after the Control due to css selectors */}
      </FormControl>
    </>
  );
  const renderCustomInputs = ({ ref }) => (
    <>
      <FormControl
        variant="floating"
        id="first-name"
        isRequired
        fontFamily={'Mulish'}
      >
        <InputGroup id="float-labelss_new">
          <Input
            readOnly
            ref={ref}
            placeholder=" "
            _placeholder={{ opacity: 1, color: 'gray.500' }}
            value={
              dateBirth
                ? `${dateBirth?.day} ${getMonthName(dateBirth?.month)} ${
                    dateBirth?.year
                  }`
                : ''
            }
            h="48px"
          />
          <InputRightElement children={<SlCalender color="green.500" />} />
          <FormLabel
            fontSize="12"
            pt="1.5"
            className={isActiveNew || dateBirth ? 'Actives' : ''}
            fontFamily={'Mulish'}
          >
            Date Of Birth
          </FormLabel>
        </InputGroup>
        {/* It is important that the Label comes after the Control due to css selectors */}
      </FormControl>
    </>
  );
  const onSave = (e) => {
    e.preventDefault();
    let i = listTravellers?.listTravellers?.length;
    let dates = `${dateOfBirth?.day} ${getMonthName(dateOfBirth?.month)} ${
      dateOfBirth?.year
    }`;
    const newAdd = {
      id: i + 1,
      typeStatus: typeStatus,
      fullName: `${firstName}${lastName}`,
      emailAddress: email,
      phoneNumber: phoneNumber,
      pasportNumber: pasportNumber,
      dateOfBirth: dates,
      placeOfBirth: placeOfBirth,
    };
    // eslint-disable-next-line no-unsafe-optional-chaining
    let travellersData = [...listTravellers?.listTravellers, newAdd];
    dispatch(setTravellersData(travellersData));
    setFirstName('');
    setLastName('');
    setPasportNumber('');
    setPhoneNumber('');
    setEmail('');
    setDateOfBirth(null);
    setPlaceOfBirth('');
    toast({
      title: 'Add Traveller Success',
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true,
      variant: 'solid',
    });
    onClose();
  };
  return (
    <Box border={'1px'} borderColor="#ebebeb">
      <Modal
        size="lg"
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Traveller</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              <FormControl
                variant="floating"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
                id="float-label"
              >
                <Box className="floating-form">
                  <Box className="floating-label">
                    <Select
                      className="floating-select"
                      placeholder=""
                      defaultValue={type}
                      h="48px"
                      onChange={handleSelectType}
                    >
                      <option value=""></option>
                      <option value="Adult">Adult</option>
                      <option value="Child">Child</option>
                    </Select>
                    <span className="highlight"></span>
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      style={{
                        transform:
                          isActiveSelectCountry || type !== ''
                            ? 'translate(0, -19px) scale(0.75)'
                            : '',
                        color:
                          isActiveSelectCountry || type !== '' ? '#065baa' : '',
                        fontSize: '14px',
                      }}
                      fontFamily={'Mulish'}
                    >
                      Select Status
                    </FormLabel>
                  </Box>
                </Box>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
            <Box>
              <RadioGroup defaultValue={select} onChange={onSelect}>
                <Stack spacing={4} direction="column">
                  <Radio value="new">
                    <Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>
                      New Traveller
                    </Text>
                  </Radio>
                  <Radio value="existing">
                    <Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>
                      Existing Traveller
                    </Text>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
            {select === 'new' ? (
              <>
                <Box>
                  <FormControl
                    variant="floating"
                    isRequired
                    fontFamily={'Mulish'}
                    mt="14px"
                    id="float-label"
                  >
                    <Box className="floating-form">
                      <Box className="floating-label">
                        <Select
                          className="floating-select"
                          placeholder=""
                          defaultValue={typeStatus}
                          h="48px"
                          onChange={handleSelectTypeStatus}
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel
                          fontSize="12"
                          pt="1.5"
                          style={{
                            transform:
                              isActiveSelectCountry || type !== ''
                                ? 'translate(0, -19px) scale(0.75)'
                                : '',
                            color:
                              isActiveSelectCountry || type !== ''
                                ? '#065baa'
                                : '',
                            fontSize: '14px',
                          }}
                          fontFamily={'Mulish'}
                        >
                          Select Type
                        </FormLabel>
                      </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                  </FormControl>
                </Box>
                <Box display={'flex'} gap="5px">
                  <FormControl variant="floating" id="first-name" isRequired>
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={firstName}
                      onChange={setFirstNames}
                      h="48px"
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel fontSize="12" pt="1.5">
                      FirstName
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                  <FormControl variant="floating" id="first-name" isRequired>
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={lastName}
                      onChange={setLastNames}
                      h="48px"
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel fontSize="12" pt="1.5">
                      LastName
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                </Box>
                <Box>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    color="#065BAA"
                    pl="5px"
                    style={{ fontSize: '12px' }}
                  >
                    As on ID Card/passport/driving license (without degree or
                    special characters)
                  </Text>
                </Box>
                <Box display={'flex'} gap="5px" mt="10px">
                  <DatePicker
                    value={dateOfBirth}
                    onChange={selectDate}
                    inputPlaceholder="Select a date" // placeholder
                    formatInputText={formatInputValue}
                    inputClassName="my-custom-input" // custom class
                    renderInput={renderCustomInput}
                    shouldHighlightWeekends
                  />
                  <FormControl variant="floating" id="first-name" isRequired>
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={placeOfBirth}
                      onChange={setPlaceOfBirths}
                      h="48px"
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel fontSize="12" pt="1.5">
                      {' '}
                      Place Of Birth
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                </Box>
                <Box w={{ base: '100%', md: '365px' }} pb="20px">
                  <FormControl
                    variant="floating"
                    id="first-name"
                    isRequired
                    fontFamily={'Mulish'}
                    mt="14px"
                  >
                    <Textarea
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={address}
                      onChange={setAddresss}
                      h="48px"
                    />
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className={isActive ? 'Active' : ''}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '14px' }}
                    >
                      Address
                    </FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                  </FormControl>
                </Box>
                <Box display={'flex'} gap="5px">
                  <FormControl variant="floating" id="first-name" isRequired>
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={email}
                      onChange={setEmailAddress}
                      h="48px"
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel fontSize="12" pt="1.5">
                      Email Address
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                  <FormControl variant="floating" id="first-name" isRequired>
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={phoneNumber}
                      onChange={setPhoneNumbers}
                      h="48px"
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel fontSize="12" pt="1.5">
                      Phone Number
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                </Box>
                <Box mt="1em">
                  <FormControl variant="floating" id="first-name" isRequired>
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={pasportNumber}
                      onChange={setPasportNumbers}
                      h="48px"
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel fontSize="12" pt="1.5">
                      Pasport Number
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                </Box>
              </>
            ) : (
              <Box display={'flex'} gap="5px" mt="3em">
                <FormControl variant="floating" id="first-name" isRequired>
                  <Input
                    placeholder=" "
                    _placeholder={{ opacity: 1, color: 'gray.500' }}
                    value={searchTraveller}
                    onChange={setSearchTravellers}
                    h="48px"
                  />
                  {/* It is important that the Label comes after the Control due to css selectors */}
                  <FormLabel fontSize="12" pt="1.5">
                    {' '}
                    Search Traveller
                  </FormLabel>
                  {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                </FormControl>
                <DatePicker
                  value={dateBirth}
                  onChange={selectDateNew}
                  inputPlaceholder="Select a date" // placeholder
                  formatInputText={formatInputValues}
                  inputClassName="my-custom-input" // custom class
                  renderInput={renderCustomInputs}
                  shouldHighlightWeekends
                />
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" mr={3} onClick={onSave}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        border={'1px'}
        borderColor="#ebebeb"
        p="12px"
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Box
          as="button"
          isDisabled={activeStep === 0}
          onClick={prevStep}
          display="flex"
          textAlign="left"
        >
          <ArrowBackIcon boxSize={4} size="sm" w={5} h={5} color="#065BAA" />
          <Heading
            fontSize="sm"
            as="b"
            color="#065BAA"
            style={{ fontSize: '16px' }}
            fontFamily="Mulish"
            fontWeight={'700'}
          >
            Change Insurance
          </Heading>
        </Box>
        <Box position={'relative'} m="auto">
          <Heading
            variant="primary"
            as="h4"
            size="md"
            style={{ fontSize: '18px' }}
            fontSize="sm"
            color="#065BAA"
            textAlign={'center'}
          >
            Fill in Travellers Data{' '}
          </Heading>
        </Box>
      </Box>
      <Box display={'flex'}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          w={{ base: '100%', md: '30%' }}
          border={'1px solid #ebebeb'}
          m="1em"
        >
          <Box bg="#F0F3F8" p="15px">
            <Box
              display="flex"
              justifyContent={'flex-start'}
              alignItems={'center'}
              pt="15px"
            >
              <Image src={Umbrella} alt="insurance" />
              <Box
                display={'flex'}
                justifyContent={'center'}
                flexDirection={'column'}
              >
                <Text
                  as="b"
                  size={'sm'}
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {selectedInsurance?.titleProduct}
                </Text>
                <Text
                  as="b"
                  size={'sm'}
                  fontFamily={'Mulish'}
                  color="#065BAA"
                  style={{ fontSize: '14px' }}
                >
                  {selectedInsurance?.cost} {'-/perorang'}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box bg="white" p="10px">
            <Box
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              boxSizing="borderBox"
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
            >
              <Text
                as="b"
                w={'50%'}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Plan Type
              </Text>
              <Text
                as="p"
                w={'50%'}
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                pl="5px"
              >
                {initStateTraveller?.coverageType}
              </Text>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'lex-start'}
              alignItems={'center'}
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
            >
              <Text
                as="b"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Travellers Type
              </Text>
              <Text
                as="p"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                pl="5px"
              >
                {initStateTraveller?.travellerType} -
                {` ${initStateTraveller?.adult} adult `}
                {`${
                  parseInt(initStateTraveller?.child) > 0
                    ? `${initStateTraveller?.child} child`
                    : ''
                }`}
              </Text>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'lex-start'}
              alignItems={'center'}
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
            >
              <Text
                as="b"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Destination
              </Text>
              <Text
                as="p"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                pl="5px"
              >
                {initStateTraveller?.destinationCountry.length > 0 &&
                  initStateTraveller?.destinationCountry.map((item, i) => {
                    return <span key={i}>{(i ? ', ' : '') + item.value}</span>;
                  })}
              </Text>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'lex-start'}
              alignItems={'center'}
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
            >
              <Text
                as="b"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Start Date
              </Text>
              <Text
                as="p"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                pl="5px"
              >
                {initStateTraveller?.startDate
                  ? `${initStateTraveller?.startDate?.day} ${getMonthName(
                      initStateTraveller?.startDate?.month
                    )} ${initStateTraveller?.startDate?.year}`
                  : null}
              </Text>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'lex-start'}
              alignItems={'center'}
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
            >
              <Text
                as="b"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                End Date
              </Text>

              <Text
                as="p"
                w="50%"
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                pl="5px"
              >
                {initStateTraveller?.endDate
                  ? `${initStateTraveller?.endDate?.day} ${getMonthName(
                      initStateTraveller?.endDate?.month
                    )} ${initStateTraveller?.endDate?.year}`
                  : null}{' '}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box w="70%" p="1em">
          {listTravellers?.listTravellers.map((travellers, i) => {
            return (
              <Box key={i} mt="1em">
                <Accordion allowMultiple>
                  <AccordionItem
                    border={'1px solid #ebebeb'}
                    borderRadius={'5px'}
                  >
                    <h2 style={{ marginBottom: '0' }}>
                      <Box as="div" role="group">
                        <AccordionButton
                          _groupHover={{
                            boxShadow:
                              '0px 0px 3px 3px rgba(153, 180, 206, 0.2)',
                            transition: '.2s',
                            bg: 'white',
                            borderRadius: '5px',
                          }}
                        >
                          <AccordionIcon />
                          <Box as="span" flex="1" textAlign="left">
                            <Text as="b" fontSize={'sm'}>
                              {'Adult'}
                              {i + 1}
                            </Text>
                          </Box>
                          <Box
                            _groupHover={{
                              display: 'none',
                            }}
                            visibility={'hidden'}
                          ></Box>
                          <Box
                            _groupHover={{
                              display: 'block',
                              visibility: 'visible',
                              transition: '.5s ease',
                            }}
                            visibility={'hidden'}
                          >
                            <IconButton
                              _groupHover={{
                                color: '#3182ce',
                              }}
                              bg="white"
                              icon={<MdCreate size="1em" />}
                              onClick={handleEditTravellersData}
                            />
                          </Box>
                        </AccordionButton>
                      </Box>
                    </h2>
                    <Box>
                      <AccordionPanel pb={4}>
                        <Box bg="white" p="10px">
                          <Box
                            display={'flex'}
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            boxSizing="borderBox"
                            borderBottom={'1px solid #ebebeb'}
                            pb="10px"
                            pt="10px"
                          >
                            <Text
                              as="b"
                              w={'50%'}
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              Full Name
                            </Text>
                            <Text
                              as="p"
                              w={'50%'}
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.fullName}
                            </Text>
                          </Box>
                          <Box
                            display={'flex'}
                            justifyContent={'lex-start'}
                            alignItems={'center'}
                            borderBottom={'1px solid #ebebeb'}
                            pb="10px"
                            pt="10px"
                          >
                            <Text
                              as="b"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              Email Address
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.emailAddress}
                            </Text>
                          </Box>
                          <Box
                            display={'flex'}
                            justifyContent={'lex-start'}
                            alignItems={'center'}
                            borderBottom={'1px solid #ebebeb'}
                            pb="10px"
                            pt="10px"
                          >
                            <Text
                              as="b"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              Phone Number
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.phoneNumber}
                            </Text>
                          </Box>
                          <Box
                            display={'flex'}
                            justifyContent={'lex-start'}
                            alignItems={'center'}
                            borderBottom={'1px solid #ebebeb'}
                            pb="10px"
                            pt="10px"
                          >
                            <Text
                              as="b"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              Passport Number
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.pasportNumber}
                            </Text>
                          </Box>
                          <Box
                            display={'flex'}
                            justifyContent={'lex-start'}
                            alignItems={'center'}
                            borderBottom={'1px solid #ebebeb'}
                            pb="10px"
                            pt="10px"
                          >
                            <Text
                              as="b"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              Date Of Birth
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.dateOfBirth}
                            </Text>
                          </Box>
                          <Box
                            display={'flex'}
                            justifyContent={'lex-start'}
                            alignItems={'center'}
                            borderBottom={'1px solid #ebebeb'}
                            pb="10px"
                            pt="10px"
                          >
                            <Text
                              as="b"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              Place Of Birth
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.placeOfBirth}
                            </Text>
                          </Box>
                        </Box>
                      </AccordionPanel>
                    </Box>
                  </AccordionItem>
                </Accordion>
              </Box>
            );
          })}
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            w="100%"
            pt="15px"
          >
            <Button
              variant="base"
              w={{ base: '100%', md: '50%' }}
              h="48px"
              onClick={onOpen}
            >
              Add Travellers
            </Button>
          </Box>
          <Box display={'flex'} justifyContent={'center'} pb="15px" pt="15px">
            or
          </Box>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            w="100%"
          >
            <Button variant="base" w={{ base: '100%', md: '50%' }} h="48px">
              Import Excel File
            </Button>
          </Box>
        </Box>
      </Box>
      {hasCompletedAllSteps !== undefined && (
        <Box>
          <Heading fontSize="xl" textAlign={'center'}>
            Woohoo! All steps completed! 🎉
          </Heading>
        </Box>
      )}
      <Flex width="100%" justify="space-between" gap={6} mt="2em" mb="2em">
        {hasCompletedAllSteps !== undefined ? (
          <Button size="sm" onClick={reset}>
            Reset
          </Button>
        ) : (
          <>
            <Box
              w={'100%'}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              p="1em"
            >
              <Box
                display={'flex'}
                justifyContent={'flex-start'}
                alignItems={'center'}
              >
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>
                  Number Of Travellers :
                </Text>
                <Text as="b" fontFamily={'Mulish'} pl="5px">
                  {listTravellers?.listTravellers?.length}
                </Text>
              </Box>
              <ButtonGroup>
                <Button
                  size="sm"
                  onClick={nextStep}
                  w={{ base: '100%', md: '270px' }}
                  h="48px"
                >
                  {isLastStep ? 'Finish' : 'CONTINUE PAYMENT'}
                </Button>
              </ButtonGroup>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};
export default Form3;
