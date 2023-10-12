/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable indent */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PulseLoader from 'react-spinners/PulseLoader';
import {
  setHistoryForm,
  historyForm,
  userLoginCurrent,
  setCredentials,
} from '../../../auth/authSlice';
import usePersist from '../../../../features/hook/usePersist';
import {
  messages,
  setMessage,
  setEditTraveller,
  EditTravellers,
  setListProducts,
  listTravellers,
  FillTravellersData,
  setTravellersData,
  selectManualInput,
  selectedTravelInsurance,
  setSelectTravelInsurancePlan,
} from '../quotaSearchSlice';
import {
  useGetListTravellerQuery,
  useGetTemplateQuery,
  useAddTravellerDataMutation,
  useEditTravellerDataMutation,
  useSearchproductsMutation,
  useGetBookingSearchQuery,
  useBooksProductsMutation,
  useCheckAvailabilityCreditMutation,
  useDeleteTravellerDataMutation,
  useGetExistingTravellerMutation,
} from '../policyApiSlice';

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
  FormErrorMessage,
  FormControl,
  FormLabel,
  ButtonGroup,
  Center,
} from '@chakra-ui/react';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl';
import Umbrella from '../../../../img/Umbrella.png';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MdCreate } from 'react-icons/md';
import CustomModal from './import';
import { CiTrash } from 'react-icons/ci';
import CurrencyFormatter from '../../../../components/formatCurrency';

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
  const { id } = useParams();
  const [triggerGetList, setTriggerGetList] = React.useState(false);
  const { data: newlistTravellers, refetch } = useGetListTravellerQuery(id, {
    skip: triggerGetList === false ? true : false,
  });
  const [persist] = usePersist();
  const listTravellers = useSelector(FillTravellersData);
  const login = useSelector(userLoginCurrent);
  const message = useSelector(messages);
  const EditTraveller = useSelector(EditTravellers);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [booksProducts, { isLoading: onsubmitloading }] =
    useBooksProductsMutation();
  const dispatch = useDispatch();
  const [searchproducts, { isLoading }] = useSearchproductsMutation();
  const [deleteTravellerData, { isSuccess: deleted, isError: deleteFail }] =
    useDeleteTravellerDataMutation();
  const [checkAvailabilityCredit] = useCheckAvailabilityCreditMutation();
  const [triggered, settriggered] = React.useState(false);
  const { data: payload, isLoading: loading } = useGetBookingSearchQuery(id);
  const { data } = useGetTemplateQuery();
  const [type, setType] = useState('Adult');
  const [typeStatus, setTypeStatus] = useState('Mr');
  const [select, setSelect] = useState('new');
  const [existingTravellers, setExistingTravellers] = useState('');
  const [travellersExisting, setTravellersExisting] = useState(null);
  const [existingTravellersDate, setExistingTravellersDate] = useState(null);
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
  const [ticketNumber, setTicketsNumber] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [relationship, setRelationship] = useState('');
  const [searchTraveller, setSearchTraveller] = useState(null);
  const [dateBirth, setDateBirth] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);

  const toast = useToast();
  const historyform = useSelector(historyForm);
  const [addTravellerData, { isSuccess, isLoading: loadingAdd }] =
    useAddTravellerDataMutation();
  const [
    getExistingTraveller,
    { isSuccess: successGetExisting, isLoading: loadingGetExisting },
  ] = useGetExistingTravellerMutation();
  const [editTravellerData, { isLoading: loadingEdit }] =
    useEditTravellerDataMutation();
  // const handleUserChange = (e) => {};

  const setPhoneNumbers = (e) => {
    // const inputValue = e.target.value;
    const newValue = e.target.value;
    if (!isNaN(newValue) || newValue === '') {
      setPhoneNumber(newValue);
    }

    // Regular expression for phone number format validation
    const phoneNumberRegex = /^(?:\+62|0)[0-9]{9,12}$/;

    // Check if the input matches the phone number format
    setIsValidPhone(phoneNumberRegex.test(newValue));
  };

  const handleExisitingTravelers = (e) => {
    setExistingTravellers(e.target.value);
  };
  const setAddresss = (e) => {
    setAddress(e.target.value);
  };
  const setEmailAddress = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    // Regular expression for email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the input matches the email format
    setIsValid(emailRegex.test(inputValue));
    setEmail(e.target.value);
    // validateEmail(e.target.value);
  };

  const setSearchTravellers = (e) => {
    setSearchTraveller(e.target.value);
  };
  const handleEditTravellersData = (data) => {
    // e.preventDefault();
    // console.log('travellers', data);
    // eslint-disable-next-line no-unused-vars
    dispatch(setEditTraveller(data));
    onOpen();
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
  const setTicketNumbers = (e) => {
    setTicketsNumber(e.target.value);
  };
  const setRelationships = (e) => {
    setRelationship(e.target.value);
  };
  const setBeneficiaries = (e) => {
    setBeneficiary(e.target.value);
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

  const selectDateExisting = (date) => {
    setExistingTravellersDate(date);
    // if (date !== null) {
    //   setIsActiveNew(true);
    // } else {
    //   setIsActiveNew(false);
    // }
  };
  console.log('test', existingTravellers, existingTravellersDate);
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
    if (!existingTravellersDate) return '';
    return `${existingTravellersDate?.day} ${getMonthName(
      existingTravellersDate?.month
    )} ${existingTravellersDate?.year}`;
  };

  const handlePrev = () => {
    const addStep = {
      ...login,
      historyStep: login?.historyStep - 1,
    };
    // console.log('ad', addStep);
    dispatch(setCredentials({ ...addStep }));
    dispatch(setHistoryForm(historyform - 1));
    prevStep();
    settriggered(false);
    handlePrevState();
  };
  console.log('loginss', payload);
  const handlePrevState = async (e) => {
    try {
      const res = await searchproducts(payload);
      if (res?.data) {
        // console.log('res', res);
        // console.log('res', payload);
        dispatch(setListProducts(res.data));
        const updatestateselectProduct = res.data.filter(
          (item) => item.id === parseInt(payload.product)
        );
        const objProuduct = updatestateselectProduct[0];
        // console.log('ss', objProuduct);
        // console.log('updatestateselectProduct', updatestateselectProduct);
        dispatch(
          setSelectTravelInsurancePlan({
            travelInsurancePlan: { ...objProuduct },
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log('payload', JSON.parse(localStorage.getItem('persist:root')));
  const handleNexts = () => {
    const addStep = {
      ...login,
      historyStep: 3,
    };

    dispatch(setCredentials({ ...addStep }));
    localStorage.setItem(
      'persist:root',
      JSON.stringify(localStorage.getItem('persist:root'))
    );
    // dispatch(setHistoryForm(historyForms + 1));
    nextStep();
  };

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave?'; // Display a confirmation message
      // handlePrev(); // Call your handlePrev function
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // const PaymentBtn = async (payload) => {
  //   try {
  //     let res = await checkAvailabilityCredit({ payload });
  //     console.log('res', res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  function formatDates(dateString) {
    // console.log('format dates', dateString);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const [year, month, day] = dateString.split('-');
    const formattedMonth = months[parseInt(month) - 1]; // Adjust for 0-based index
    console.log('year', year, month, day);
    return {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
    };
  }

  React.useEffect(() => {
    if (EditTraveller) {
      let dates;
      if (EditTraveller?.dateOfBirth) {
        formatDates(EditTraveller?.dateOfBirth);
      }
      // console.log('dates', formatDates(EditTraveller?.dateOfBirth));
      setPhoneNumber(EditTraveller?.phone);
      setFirstName(EditTraveller?.firstName);
      setLastName(EditTraveller?.lastName);
      setAddress(EditTraveller?.address);
      setPlaceOfBirth(EditTraveller?.placeOfBirth);
      setDateOfBirth(formatDates(EditTraveller?.dateOfBirth));
      setEmail(EditTraveller?.email);
      setPasportNumber(EditTraveller?.passport);
      setTypeStatus(EditTraveller?.title);
      setType(EditTraveller?.travellerType);
      setBeneficiary(EditTraveller?.beneficiary);
      setTicketsNumber(EditTraveller?.ticketFlightNumber);
      setRelationship(EditTraveller?.relationship);
    }
  }, [EditTraveller]);

  // console.log('EditTraveller', EditTraveller);
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
              existingTravellersDate
                ? `${existingTravellersDate?.day} ${getMonthName(
                    existingTravellersDate?.month
                  )} ${existingTravellersDate?.year}`
                : ''
            }
            h="48px"
          />
          <InputRightElement children={<SlCalender color="green.500" />} />
          <FormLabel
            fontSize="12"
            pt="1.5"
            // className={isActiveNew || existingTravellersDate ? 'Actives' : ''}
            fontFamily={'Mulish'}
          >
            Date Of Birth
          </FormLabel>
        </InputGroup>
        {/* It is important that the Label comes after the Control due to css selectors */}
      </FormControl>
    </>
  );
  function formatDate(inputDate) {
    const parts = inputDate.split('-');
    const year = parts[0];
    const month = parts[1].length === 1 ? '0' + parts[1] : parts[1];
    const day = parts[2].length === 1 ? '0' + parts[2] : parts[2];

    return `${year}-${month}-${day}`;
  }
  const handleCloseModal = () => {
    onClose();
    setFirstName('');
    setLastName('');
    setPasportNumber('');
    setPhoneNumber('');
    setEmail('');
    setDateOfBirth(null);
    setPlaceOfBirth('');
    setAddress('');
    setBeneficiary('');
    setRelationship('');
    setTicketsNumber('');
  };
  const getTravellersExisting = async (e) => {
    let dates = formatDate(
      `${existingTravellersDate?.year}-${existingTravellersDate?.month}-${existingTravellersDate?.day}`
    );
    const params = {
      fullname: existingTravellers,
      dateOfBirth: dates,
    };
    try {
      const response = await getExistingTraveller(params);
      console.log('response', response);
      setTravellersExisting(response);
    } catch (error) {
      console.log(error);
    }
  };
  const onSave = async (e) => {
    e.preventDefault();
    let i = listTravellers?.listTravellers?.length;
    let dates = formatDate(
      `${dateOfBirth?.year}-${dateOfBirth?.month}-${dateOfBirth?.day}`
    );
    const now = new Date();
    const newAdd = {
      bookingId: listTravellers?.bookingId,
      firstName: firstName,
      lastName: lastName,
      title: typeStatus,
      travellerType: type,
      fullName: `${firstName}${lastName}`,
      email: email,
      phone: phoneNumber,
      address: address,
      passport: pasportNumber,
      dateOfBirth: dates,
      placeOfBirth: placeOfBirth,
      ticketFlightNumber: ticketNumber,
      flightItinerary: 'New York to London',
      endorsement: 'Some endorsement text',
      refundEndorsement: 'Refund endorsement text',
      beneficiary: beneficiary !== '' ? beneficiary : '',
      relationship: relationship !== '' ? relationship : '',
    };
    // // eslint-disable-next-line no-unsafe-optional-chaining
    // let travellersData = [...listTravellers?.listTravellers, newAdd];
    // dispatch(setTravellersData(travellersData));
    setFirstName('');
    setLastName('');
    setPasportNumber('');
    setPhoneNumber('');
    setEmail('');
    setDateOfBirth(null);
    setPlaceOfBirth('');
    setAddress('');
    setBeneficiary('');
    setRelationship('');
    setTicketsNumber('');
    toast({
      id: 'addTraveller',
      title: 'Add Traveller Success',
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true,
      variant: 'solid',
    });
    try {
      const res = await addTravellerData(newAdd);
      if (res.data) {
        dispatch(
          setTravellersData([...listTravellers?.listTravellers, res?.data])
        );
      }
      onClose();
    } catch (error) {
      console.log('error adding');
    }
  };
  console.log('travellersExisting', travellersExisting);
  const onSaveExisting = async (e) => {
    console.log('siniii');
    e.preventDefault();
    let i = listTravellers?.listTravellers?.length;
    let dates = formatDate(
      `${dateOfBirth?.year}-${dateOfBirth?.month}-${dateOfBirth?.day}`
    );
    const now = new Date();
    const newAdd = {
      bookingId: travellersExisting?.data?.bookingId,
      firstName: travellersExisting?.data?.firstName,
      lastName: travellersExisting?.data?.lastName,
      title: travellersExisting?.data?.title,
      travellerType: travellersExisting?.data?.travellerType,
      fullName: `${travellersExisting?.data?.firstName}${travellersExisting?.data?.lastName}`,
      email: travellersExisting?.data?.email,
      phone: travellersExisting?.data?.phone,
      address: travellersExisting?.data?.address,
      passport: travellersExisting?.data?.passport,
      dateOfBirth: travellersExisting?.data.dateOfBirth,
      placeOfBirth: travellersExisting?.data?.placeOfBirth,
      ticketFlightNumber: travellersExisting?.data?.ticket,
      flightItinerary: 'travellersExisting?.data',
      endorsement: 'Some endorsement text',
      refundEndorsement: 'Refund endorsement text',
      beneficiary:
        travellersExisting?.data?.beneficiary !== ''
          ? travellersExisting?.data?.beneficiary
          : '',
      relationship:
        travellersExisting?.data?.relationship !== ''
          ? travellersExisting?.data?.relationship
          : '',
    };
    // // eslint-disable-next-line no-unsafe-optional-chaining
    // let travellersData = [...listTravellers?.listTravellers, newAdd];
    // dispatch(setTravellersData(travellersData));
    setFirstName('');
    setLastName('');
    setPasportNumber('');
    setPhoneNumber('');
    setEmail('');
    setDateOfBirth(null);
    setPlaceOfBirth('');
    setAddress('');
    setBeneficiary('');
    setRelationship('');
    setTicketsNumber('');
    setTravellersExisting(null);
    toast({
      id: 'addTraveller',
      title: 'Add Traveller Success',
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true,
      variant: 'solid',
    });
    try {
      const res = await addTravellerData(newAdd);
      if (res.data) {
        dispatch(
          setTravellersData([...listTravellers?.listTravellers, res?.data])
        );
      }
      onClose();
    } catch (error) {
      console.log('error adding');
    }
  };
  const onEdit = async (e) => {
    e.preventDefault();
    let i = listTravellers?.listTravellers?.length;
    let dates = formatDate(
      `${dateOfBirth?.year}-${dateOfBirth?.month}-${dateOfBirth?.day}`
    );
    const now = new Date();
    const newAdd = {
      id: EditTraveller?.id,
      bookingId: listTravellers?.bookingId,
      firstName: firstName,
      lastName: lastName,
      title: typeStatus,
      travellerType: type,
      fullName: `${firstName}${lastName}`,
      email: email,
      phone: phoneNumber,
      address: address,
      passport: pasportNumber,
      dateOfBirth: dates,
      placeOfBirth: placeOfBirth,
      ticketFlightNumber: ticketNumber,
      flightItinerary: 'New York to London',
      endorsement: 'Some endorsement text',
      refundEndorsement: 'Refund endorsement text',
      beneficiary: beneficiary !== '' ? beneficiary : '',
      relationship: relationship !== '' ? relationship : '',
    };
    // // eslint-disable-next-line no-unsafe-optional-chaining
    // let travellersData = [...listTravellers?.listTravellers, newAdd];
    // dispatch(setTravellersData(travellersData));
    setFirstName('');
    setLastName('');
    setPasportNumber('');
    setPhoneNumber('');
    setEmail('');
    setDateOfBirth(null);
    setPlaceOfBirth('');
    setAddress('');
    setBeneficiary('');
    setRelationship('');
    setTicketsNumber('');
    toast({
      id: 'editTraveller',
      title: 'Edit Traveller Success',
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true,
      variant: 'solid',
    });
    try {
      const res = await editTravellerData(newAdd);
      if (res.data) {
        dispatch(setEditTraveller(null));
        let travellersData = listTravellers?.listTravellers.map((traveller) => {
          if (traveller.id === res.data.id) {
            return traveller;
          }
        });
        dispatch(setMessage(true));
        // console.log('tra', travellersData);
        // dispatch(
        //   setTravellersData([
        //     ...listTravellers?.listTravellers,
        //     ...travellersData,
        //   ])
        // );
      }
      onClose();
    } catch (error) {
      console.log('error adding');
    }
  };

  React.useEffect(() => {
    let timer;

    if (message) {
      timer = setTimeout(() => {
        dispatch(setMessage(false));
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, message]);

  // console.log('newlistTravellers', newlistTravellers);
  React.useEffect(() => {
    if (newlistTravellers) {
      dispatch(setTravellersData([...newlistTravellers]));
    }
  }, [dispatch, newlistTravellers]);

  const handleAddTraveller = () => {
    dispatch(setEditTraveller(null));
    onOpen();
  };

  function formatDateToLong(dateString) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const monthName = monthNames[monthIndex];

    const formattedDate = `${day} ${monthName} ${year}`;
    return formattedDate;
  }

  const handleDelete = async (id) => {
    console.log('idd', id);
    // e.preventDefault();
    try {
      const res = await deleteTravellerData(id.id);
      const idx = 'deletetraveller';
      // console.log('red del', res);
      if (res.data === null) {
        if (!toast.isActive(idx)) {
          toast({
            id: 'deletetraveller',
            title: 'Delete Success',
            status: 'success',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
            variant: 'solid',
          });
        }
        setTriggerGetList(true);
        // refetch(id.id);
        // navigate('/master-data/travel-agent');
      }
    } catch (err) {
      toast({
        id: 'deletetraveller',
        title: `${err?.originalStatus}`,
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
        variant: 'solid',
      });
    }
  };
  console.log('existing', travellersExisting);
  React.useEffect(() => {
    if (deleted && triggerGetList) {
      refetch(id);
    }
  }, [deleted, refetch, id, triggerGetList]);

  console.log('select', select);
  return (
    <Box border={'1px'} borderColor="#ebebeb">
      <Modal
        size="xl"
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
        placement="bottom-start"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Traveller</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              {select === 'existing' && (
                <Box
                  minH="200px"
                  m="auto"
                  bg="#f6f2f2"
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  {travellersExisting !== null ? (
                    <Box mt="1em" w="100%">
                      <Box>
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
                              Full Name
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {`${travellersExisting?.data?.firstName} ${travellersExisting?.data?.lastName}`}
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
                              Email Address
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {travellersExisting?.data?.email}
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
                              Phone Number
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {travellersExisting?.data?.phone}
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
                              Identitiy Card/ Passport
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {travellersExisting?.data?.passport}
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
                              Date Of Birth
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {formatDateToLong(
                                travellersExisting?.data?.dateOfBirth
                              )}
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
                              Place Of Birth
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {travellersExisting?.data?.placeOfBirth}
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
                              Address
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {travellersExisting?.data?.address}
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
                              Beneficiary
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {travellersExisting?.data?.beneficiary
                                ? travellersExisting?.data?.beneficiary
                                : '-'}
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
                              Relationship
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                            >
                              {travellersExisting?.data?.relationship
                                ? travellersExisting?.data.relationship
                                : '-'}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Text as="p" style={{ width: '100%', textAlign: 'center' }}>
                      result
                    </Text>
                  )}
                </Box>
              )}
              <RadioGroup
                defaultValue={select}
                onChange={onSelect}
                mt={select !== 'new' ? '10px' : '0px'}
              >
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
                          borderRadius={'5px'}
                          className="floating-select"
                          placeholder=""
                          defaultValue={type}
                          h="48px"
                          onChange={handleSelectType}
                          style={{
                            backgroundColor: type !== '' ? '#e8f0fe' : '',
                          }}
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
                                ? 'translate(0, -9px) scale(0.75)'
                                : '',
                            color:
                              isActiveSelectCountry || type !== ''
                                ? '#065baa'
                                : '',
                            fontStyle:
                              isActiveSelectCountry || type !== ''
                                ? 'italic'
                                : 'normal',
                            fontSize:
                              isActiveSelectCountry || type !== ''
                                ? '12px'
                                : '14px',
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
                          borderRadius={'5px'}
                          className="floating-select"
                          placeholder=""
                          defaultValue={typeStatus}
                          h="48px"
                          onChange={handleSelectTypeStatus}
                          style={{
                            backgroundColor: typeStatus !== '' ? '#e8f0fe' : '',
                          }}
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
                                ? 'translate(0, -9px) scale(0.75)'
                                : '',
                            color:
                              isActiveSelectCountry || type !== ''
                                ? '#065baa'
                                : '',
                            fontSize: '14px',
                          }}
                          fontFamily={'Mulish'}
                        >
                          Select Title
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
                      style={{
                        backgroundColor: firstName !== '' ? '#e8f0fe' : '',
                      }}
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className="floating-label-global"
                    >
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
                      style={{
                        backgroundColor: typeStatus !== '' ? '#e8f0fe' : '',
                      }}
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className="floating-label-global"
                    >
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
                    style={{
                      backgroundColor: dateOfBirth !== null ? '#e8f0fe' : '',
                    }}
                  />
                  <FormControl variant="floating" id="first-name" isRequired>
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={placeOfBirth}
                      onChange={setPlaceOfBirths}
                      h="48px"
                      style={{
                        backgroundColor: placeOfBirth !== '' ? '#e8f0fe' : '',
                      }}
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className="floating-label-global"
                    >
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
                      pt="1em"
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={address}
                      onChange={setAddresss}
                      style={{
                        backgroundColor: address !== '' ? '#e8f0fe' : '',
                        fontSize: '12px',
                        fontfamily: 'Mulish',
                      }}
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
                  <FormControl
                    variant="floating"
                    id="first-name"
                    isRequired
                    isInvalid={!isValid}
                  >
                    <Input
                      type="email"
                      placeholder=""
                      value={email}
                      onChange={setEmailAddress}
                      h="48px"
                      style={{
                        backgroundColor: email !== '' ? '#e8f0fe' : '',
                      }}
                    />
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className="floating-label-global"
                    >
                      Email
                    </FormLabel>
                    <FormErrorMessage>
                      {!isValid && 'Invalid email address format'}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    variant="floating"
                    id="first-name"
                    isRequired
                    isInvalid={!isValidPhone}
                  >
                    <Input
                      type="tel"
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={phoneNumber}
                      onChange={setPhoneNumbers}
                      h="48px"
                      style={{
                        backgroundColor: phoneNumber !== '' ? '#e8f0fe' : '',
                      }}
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className="floating-label-global"
                    >
                      Phone Number
                    </FormLabel>
                    <FormErrorMessage>
                      {!isValidPhone && 'Invalid phone number format'}
                    </FormErrorMessage>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                </Box>
                <Box display={'flex'} gap="5px" mt="1em">
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
                  <FormControl variant="floating" id="first-name">
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={ticketNumber}
                      onChange={setTicketNumbers}
                      h="48px"
                      style={{
                        backgroundColor: ticketNumber !== '' ? '#e8f0fe' : '',
                      }}
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className="floating-label-global"
                    >
                      Ticket Number
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                </Box>
                <Box display={'flex'} gap="5px" mt="1em">
                  <FormControl variant="floating" id="first-name">
                    <Input
                      placeholder=" "
                      _placeholder={{ opacity: 1, color: 'gray.500' }}
                      value={beneficiary}
                      onChange={setBeneficiaries}
                      h="48px"
                      style={{
                        backgroundColor: beneficiary !== '' ? '#e8f0fe' : '',
                      }}
                    />
                    {/* It is important that the Label comes after the Control due to css selectors */}
                    <FormLabel
                      fontSize="12"
                      pt="1.5"
                      className="floating-label-global"
                    >
                      Beneficiary
                    </FormLabel>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                  <FormControl>
                    <Box className="floating-form">
                      <Box>
                        <Select
                          style={{
                            backgroundColor:
                              relationship !== '' ? '#e8f0fe' : '',
                          }}
                          // className="floating-select"
                          placeholder=""
                          defaultValue={relationship}
                          h="48px"
                          onChange={setRelationships}
                        >
                          <option value="" className="">
                            Relationship
                          </option>
                          <option value="parent">Parent</option>
                          <option value="child">Child</option>
                          <option value="close-family">Close Family</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel
                          pt="1.5"
                          style={{
                            transform:
                              relationship !== ''
                                ? 'translate(-21px, -54px) scale(0.75)'
                                : 'translate(-21px, -40px) scale(0.75)',
                            background: relationship === '' ? 'white' : '',
                            fontSize: '14px',
                            fontFamily: 'Mulish',
                            fontWeight: '600',
                            color:
                              relationship === '' ? '#000000c9' : '#065baa',
                          }}
                          _hover={{
                            backgroundColor: 'none',
                          }}
                          fontFamily={'Mulish'}
                        >
                          Relationship
                        </FormLabel>
                      </Box>
                    </Box>
                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                  </FormControl>
                </Box>
              </>
            ) : (
              <Box>
                <Box
                  display={'flex'}
                  gap="5px"
                  mt="3em"
                  flexDirection={'column'}
                >
                  <Box
                    mt="1em"
                    position={'relative'}
                    zIndex={'0'}
                    display={'flex'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap="4px"
                    width={{ base: '100%', md: '530px' }}
                  >
                    <Box>
                      <FormControl
                        variant="floating"
                        id="first-name"
                        isRequired
                      >
                        <FormLabel
                          fontSize="12"
                          pt="1.5"
                          fontFamily={'Mulish'}
                          style={{
                            transform: 'translate(-11px, -33px) scale(0.75)',
                            fontSize: '18px',
                            background: 'white',
                            color: '#171923',
                          }}
                        >
                          Name Traveller
                        </FormLabel>
                        <Input
                          placeholder=" "
                          _placeholder={{ opacity: 1, color: 'gray.500' }}
                          value={existingTravellers}
                          name="name"
                          onChange={handleExisitingTravelers}
                          h="48px"
                        />

                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                      </FormControl>
                    </Box>
                    <Box width={{ base: '100%', md: '250px' }}>
                      <FormControl
                        variant="floating"
                        id="first-name"
                        isRequired
                        fontFamily={'Mulish'}
                      >
                        <FormLabel
                          fontSize="12"
                          pt="1.5"
                          fontFamily={'Mulish'}
                          style={{
                            transform: 'translate(16px, 2px) scale(0.75)',
                            fontSize: '18px',
                            background: '#ebebeb',
                            color: '#171923',
                          }}
                        >
                          Date OF Birth
                        </FormLabel>
                        <Box className="datepicker-container">
                          <DatePicker
                            // calendarPopperPosition="auto"
                            value={existingTravellersDate}
                            onChange={selectDateExisting}
                            inputPlaceholder="Select a date" // placeholder
                            formatInputText={formatInputValues}
                            // inputClassName="my-custom-inputs" // custom class
                            renderInput={renderCustomInputs}
                            // wrapperClassName={'calendarClassName'}
                            calendarClassName="custom-datepicker"
                            shouldHighlightWeekends
                          />
                        </Box>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box mt="10px">
                    <Button
                      variant={'outline'}
                      onClick={getTravellersExisting}
                      isDisabled={
                        existingTravellers === '' ||
                        existingTravellersDate === null
                          ? true
                          : false
                      }
                    >
                      Search
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} disabled={loadingEdit || loadingAdd}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={
                EditTraveller !== null
                  ? onEdit
                  : travellersExisting !== null
                  ? onSaveExisting
                  : onSave
              }
              disabled={loadingEdit || loadingAdd}
              isLoading={loadingEdit || loadingAdd}
            >
              {EditTraveller !== null ? 'Edit' : 'Add'}
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
          onClick={handlePrev}
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
          {loading ? (
            <Center h="50vh">
              <PulseLoader color={'#FFF'} />
            </Center>
          ) : (
            <Box>
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
                      {payload?.bookingProduct?.productName}
                    </Text>
                    <Text
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      color="#065BAA"
                      style={{ fontSize: '14px' }}
                    >
                      {
                        <CurrencyFormatter
                          amount={payload?.bookingProduct?.finalPrice}
                        />
                      }{' '}
                      {'-/ per orang'}
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
                    {payload?.coverType}
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
                    {payload?.travellerType?.name} -{` ${payload?.adt} adult `}
                    {`${
                      parseInt(payload?.chd) > 0 ? `${payload?.chd} child` : ''
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
                    {payload?.destinations.length > 0 &&
                      payload?.destinations.map((item, i) => {
                        return (
                          <span key={i}>
                            {(i ? ', ' : '') + item.countryName}
                          </span>
                        );
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
                    {formatDateToLong(payload?.from)}
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
                    {formatDateToLong(payload?.to)}
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
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
                              {`${travellers?.firstName} ${travellers?.lastName}`}
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
                              onClick={() =>
                                handleEditTravellersData(travellers)
                              }
                            >
                              {/* <Button
                                key={i}
                                onClick={handleEditTravellersData(i)}
                              /> */}
                            </IconButton>
                            <IconButton
                              _groupHover={{
                                color: '#3182ce',
                              }}
                              bg="white"
                              icon={<CiTrash size="1em" />}
                              onClick={() =>
                                handleDelete({ id: travellers.id })
                              }
                            >
                              {/* <Button
                                key={i}
                                onClick={handleEditTravellersData(i)}
                              /> */}
                            </IconButton>
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
                              Title
                            </Text>
                            <Text
                              as="p"
                              w={'50%'}
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.title}
                            </Text>
                          </Box>
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
                              Traveller Type
                            </Text>
                            <Text
                              as="p"
                              w={'50%'}
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.travellerType}
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
                              {travellers.email}
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
                              {travellers.phone}
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
                              {travellers.passport === null
                                ? '-'
                                : travellers.passport}
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
                              Address
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.address}
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
                              Beneficiary
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.beneficiary
                                ? travellers.beneficiary
                                : '-'}
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
                              Realtionship
                            </Text>
                            <Text
                              as="p"
                              w="50%"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '12px' }}
                              pl="5px"
                            >
                              {travellers.relationship
                                ? travellers.relationship
                                : '-'}
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
              onClick={handleAddTraveller}
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
            <CustomModal
              showModalButtonText="Import"
              modalHeader="Import Excel File"
              modalBody="Import Excel File"
            />
            {/* <Button variant="base" w={{ base: '100%', md: '50%' }} h="48px">
              Import Excel File
            </Button> */}
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
                  onClick={handleNexts}
                  w={{ base: '100%', md: '270px' }}
                  h="48px"
                  isDisabled={
                    listTravellers?.listTravellers?.length === 0 ||
                    parseInt(payload?.adt) + parseInt(payload?.chd) !==
                      listTravellers?.listTravellers?.length
                      ? true
                      : false
                  }
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
