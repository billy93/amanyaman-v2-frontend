/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import PulseLoader from 'react-spinners/PulseLoader';
import { Navigate, useNavigate, useParams, NavLink } from 'react-router-dom';
import {
  Text,
  Center,
  Textarea,
  Menu,
  RadioGroup,
  Stack,
  MenuButton,
  MenuList,
  MenuItem,
  Radio,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
  Flex,
  InputRightElement,
  InputGroup,
  Heading,
  Image,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  IconButton,
  Box,
  Button,
  FormControl,
  FormLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl';
import {
  useGetBookingByIdQuery,
  useDownloadPolicyQuery,
  useUpdateDataPolicyMutation,
} from './policyApiSlice';
import Files from '../../../img/images/Files.png';
import Plan from '../../../img/images/Plane.png';
import Pasport from '../../../img/images/Passport.png';
import Umbrella from '../../../img/Umbrella.png';
import Payment from '../../../img/Payment.png';
import PaymentSuccessBg from '../../../img/images/Naturescape.png';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FiMoreVertical } from 'react-icons/fi';
import {
  AiOutlineDownload,
  AiOutlineUpload,
  AiOutlineMail,
  AiOutlineFolderView,
} from 'react-icons/ai';
import { BiRefresh } from 'react-icons/bi';
import { BsCreditCard2Front } from 'react-icons/bs';
import EmailInput from './emailForm';
import { message, setStateMessage } from './policySlice';
import View from './view';
import UseCustomToast from '../../../components/UseCustomToast';

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
const PolicyDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messages = useSelector((state) => state.PolicyList);
  const [
    updateDataPolicy,
    {
      isLoading: isLoadingSubmit,
      isSuccess: isSuccessSubmit,
      isError: isErrorSubmit,
    },
  ] = useUpdateDataPolicyMutation();
  const { id, policyNumberString } = useParams();
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const [formData, setFormData] = useState({
    email: '',
  });
  const [width, setWidth] = React.useState(500); // Default width
  const [numPages, setNumPages] = React.useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const iframeRef = React.useRef(null);

  const handleIframeLoad = () => {
    // Access the iframe's contentDocument and body
    const iframeDoc = iframeRef.current.contentDocument;
    const iframeBody = iframeDoc.body;

    // Add your custom iframe styles here if needed
    iframeRef.current.style.width = '100%';
    iframeRef.current.style.height = '100vh';

    // Clean up the iframe when the modal is closed
    // onClose && onClose();

    // Clean up any event listeners or resources as needed
    // You can use the 'beforeunload' event if required
  };

  // Calculate responsive width based on the modal content width
  const modalContentWidth = 60; // Percentage of modal width
  React.useEffect(() => {
    const maxWidth = window.innerWidth * (modalContentWidth / 100);
    setWidth(maxWidth);
  }, [setViewModal]);
  const [isActive] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { data: checkstatus, refetch, isSuccess } = useGetCheckPaymentQuery(id);
  const {
    data: quotation,
    isLoading,
    isError,
    refetch,
    isSuccess,
  } = useGetBookingByIdQuery(id);
  const [onTrigger, setOnTrigger] = useState(true);
  const [onTriggerView, setOnTriggerView] = useState(true);
  const [dataQuotation, setDataQuotation] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const getTravellerId = React.useCallback(
    (type) => {
      let idTraveller;
      if (type) {
        let data = quotation?.travellers.filter(
          (quotation) => quotation.policyNumber === type
        );
        // console.log('ddddd', data);
        idTraveller = `${id}/${data && data[0]?.id}`;
      } else {
        idTraveller = `${id}/${quotation && quotation[0]?.travellers[0].id}`;
      }
      return idTraveller;
    },
    [quotation]
  );

  const {
    data: downloadPolicy,
    isLoading: loadingDownload,
    isError: isErrorDownload,
    isSuccess: isSuccessDownload,
  } = useDownloadPolicyQuery(getTravellerId(policyNumberString), {
    skip: onTrigger,
  });
  const {
    data: viewPolicy,
    isLoading: loadingView,
    isError: isErrorView,
    isSuccess: isSuccessView,
  } = useDownloadPolicyQuery(getTravellerId(policyNumberString), {
    skip: onTriggerView,
  });
  const handleDownload = () => {
    setOnTrigger(false);
  };

  const [isActives, setActives] = useState(false);

  const openNewTab = async (url) => {
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.location.href = url;
      return newTab;
    } else {
      console.error('Failed to open a new tab.');
      return null;
    }
  };

  React.useEffect(() => {
    downloadAndOpenPdfInNewTab(downloadPolicy);
  }, [downloadPolicy]);

  const downloadAndOpenPdfInNewTab = async (downloadPolicy) => {
    if (!downloadPolicy) {
      console.error('PDF data is missing.');
      return;
    }

    const newTab = await openNewTab(downloadPolicy);

    if (newTab) {
      // Create an iframe in the new tab and set its source to the PDF data URL
      const iframe = document.createElement('iframe');
      iframe.src = downloadPolicy;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      newTab.document.body.appendChild(iframe);

      // Clean up the blob URL when the new tab is closed
      newTab.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(downloadPolicy);
      });
    }
  };

  React.useEffect(() => {
    getTravellerId(policyNumberString);
  }, [policyNumberString, getTravellerId]);

  const handleEmailChange = (e) => {
    setCurrentEmail(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentEmail.trim() !== '') {
      setEmails([...emails, currentEmail.trim()]);
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
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

  React.useEffect(() => {
    if (id) {
      refetch(id);
    }
  }, [id]);

  const handleMenu = () => {};
  const handleRedirect = () => {
    navigate('/policies/list');
  };

  const addEmail = () => {
    onOpen();
  };

  const prevMessage = usePrevious(messages);
  React.useEffect(() => {
    if (prevMessage !== messages) {
      if (messages === 'fulfilled') {
        onClose();
      }
    }
  }, [messages, prevMessage]);

  React.useEffect(() => {
    let timer;

    if (messages) {
      timer = setTimeout(() => {
        dispatch(setStateMessage(null));
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, messages]);

  const handleClose = () => {
    onClose();
  };

  function handleSelectType(selectedOption, additionalParam) {
    let newdata = [...dataQuotation];
    const forms = {
      ...dataQuotation[additionalParam],
      travellerType: selectedOption.label,
      type: [
        {
          label: selectedOption.label,
          value: selectedOption.label,
        },
      ],
      // title: [{'label':dataQuotation.title}],
    };
    newdata[additionalParam] = forms;

    setDataQuotation([...newdata]);
  }

  function handleSelectRelations(selectedOption, additionalParam) {
    let newdata = [...dataQuotation];
    const forms = {
      ...dataQuotation[additionalParam],
      relationship: selectedOption.label,
      relations: [
        {
          label: selectedOption.label,
          value: selectedOption.label,
        },
      ],
      // title: [{'label':dataQuotation.title}],
    };
    newdata[additionalParam] = forms;

    setDataQuotation([...newdata]);
  }

  function handleSelectTitle(selectedOption, additionalParam) {
    let newdata = [...dataQuotation];
    const forms = {
      ...dataQuotation[additionalParam],
      title: selectedOption.label,
      label: [
        {
          label: selectedOption.label,
          value: selectedOption.label,
        },
      ],
      // title: [{'label':dataQuotation.title}],
    };
    newdata[additionalParam] = forms;

    setDataQuotation([...newdata]);
  }

  const setSelectedDates = (selectDate, i) => {
    const data = [...dataQuotation];
    data[i].dateOfBirth = selectDate;
    setDataQuotation([...data]);
    // console.log('setSelecteddate', selectDate);
  };
  // console.log('newdata forms dataQuotation', dataQuotation);
  // console.log('newdata forms dataQuotation', quotation);

  function removePropertiesFromArray(array, propertiesToRemove) {
    return array.map((item) => {
      const updatedItem = { ...item };
      propertiesToRemove.forEach((propertyName) => {
        delete updatedItem[propertyName];
      });
      return updatedItem;
    });
  }

  function convertDateObjectToString(dateObject) {
    const { year, month, day } = dateObject;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  // console.log('number string', policyNumberString);
  const getTravellers = () => {
    let data = [];

    return data;
  };
  const handleUpdate = async () => {
    const quotData = [...dataQuotation];
    let listtravellers = [];
    listtravellers =
      dataQuotation?.travellerType === 'Individual'
        ? dataQuotation?.filter(
            (policy) => policy.policyNumber === policyNumberString
          )
        : [...dataQuotation];
    // console.log('quotData', quotData);
    const convertData = quotData.map((data) => ({
      ...data,
      dateOfBirth: convertDateObjectToString(data?.dateOfBirth),
    }));

    // console.log('asas', convertData);
    const propertiesToRemove = ['type', 'label', 'relations'];
    const list = removePropertiesFromArray(convertData, propertiesToRemove);

    const data = {
      bookingId: quotation?.id,
      travellers: [...list],
    };
    console.log('dtravs', data);
    try {
      const response = await updateDataPolicy(data);
      // console.log('response', response);
      if (response) {
        navigate('/policies/list');
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (isSuccessSubmit) {
      showSuccessToast('Update successfully');
      refetch();
    }
  }, [isSuccessSubmit]);

  React.useEffect(() => {
    if (isErrorSubmit) {
      showErrorToast('Update fail');
    }
  }, [isErrorSubmit]);

  const handleView = () => {
    setOnTriggerView(false);
    setViewModal(!viewModal);
    // setOnTrigger(true);
  };

  function formatDateToObject(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day };
  }

  React.useEffect(() => {
    // const dataUserDetail = users?.filter((user) => user.id === parseInt(id))
    if (quotation?.travellerType?.name === 'Individual') {
      let data = quotation?.travellers?.filter(
        (quotation) => quotation?.policyNumber === policyNumberString
      );
      if (data) {
        let city = data.map((obj, i) => ({
          ...obj,
          label: [{ label: obj.title, value: obj.title }],
          type: [{ label: obj.travellerType, value: obj.travellerType }],
          dateOfBirth: formatDateToObject(obj.dateOfBirth),
          relations: [{ label: obj.relationship, value: obj.relationship }],
        }));
        setDataQuotation([...city]);
        console.log('cty1', city);
      }
    } else {
      let city = quotation?.travellers.map((obj, i) => ({
        ...obj,
        label: [{ label: obj.title, value: obj.title }],
        type: [{ label: obj.travellerType, value: obj.travellerType }],
        dateOfBirth: formatDateToObject(obj.dateOfBirth),
        relations: [{ label: obj.relationship, value: obj.relationship }],
      }));
      console.log('cty2', city);
      setDataQuotation(city);
    }
  }, [quotation?.travellers, quotation]);
  // console.log('quotation', quotation);
  console.log('quotation data', dataQuotation);
  const titles = [
    {
      value: 'Mr.',
      label: 'Mr.',
    },
    {
      value: 'Mrs.',
      label: 'Mrs.',
    },
    {
      value: 'Ms.',
      label: 'Ms.',
    },
  ];

  const types = [
    {
      value: 'Adult',
      label: 'Adult',
    },
    {
      value: 'Child.',
      label: 'Child',
    },
  ];

  const relations = [
    {
      value: 'Parent',
      label: 'Parent',
    },
    {
      value: 'Child.',
      label: 'Child',
    },
    {
      value: 'Close Family',
      label: 'Close Family',
    },
    {
      value: 'Test',
      label: 'Test',
    },
  ];
  React.useEffect(() => {
    const maxWidth = window.innerWidth * (modalContentWidth / 100);
    setWidth(maxWidth);
  }, [viewModal]);

  const setAddresss = (e, i) => {
    const data = [...dataQuotation];
    data[i].address = e.target.value;
    setDataQuotation([...data]);
  };

  const setPhoneNumbers = (e, i) => {
    const data = [...dataQuotation];
    data[i].phone = e.target.value;
    setDataQuotation([...data]);
  };
  const setPassport = (e, i) => {
    const data = [...dataQuotation];
    data[i].passport = e.target.value;
    setDataQuotation([...data]);
  };

  const setTicket = (e, i) => {
    const data = [...dataQuotation];
    data[i].ticket = e.target.value;
    setDataQuotation([...data]);
  };

  const setRelationships = (e, i) => {
    const data = [...dataQuotation];
    data[i].relationship = e.target.value;
    setDataQuotation([...data]);
  };

  const setBeneficiary = (e, i) => {
    const data = [...dataQuotation];
    data[i].beneficiary = e.target.value;
    setDataQuotation([...data]);
  };

  const setEmailAddress = (e, i) => {
    const data = [...dataQuotation];
    data[i].email = e.target.value;
    setDataQuotation([...data]);
  };
  // console.log('view closed dataQuotation', dataQuotation);
  function updateDataById(idToUpdate, newData) {
    // Find the index of the element with the matching ID
    const index = viewModal.findIndex((item) => item.id === idToUpdate);

    // If the ID was found in the array
    if (index !== -1) {
      // Create a new array with the updated data (ensuring immutability)
      const updatedData = [...viewModal];
      updatedData[index] = { ...updatedData[index], ...newData };

      // Return the updated array
      return updatedData;
    } else {
      // If the ID was not found, return the original array
      return viewModal;
    }
  }
  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });

    return formatter.format(date);
  }

  const setFirstName = (e, i) => {
    const data = [...dataQuotation];
    data[i].firstName = e.target.value;
    setDataQuotation([...data]);
  };
  const setPlaceOfBirth = (e, i) => {
    const data = [...dataQuotation];
    data[i].placeOfBirth = e.target.value;
    setDataQuotation([...data]);
  };

  const setLastName = (e, i) => {
    const data = [...dataQuotation];
    data[i].lastName = e.target.value;
    setDataQuotation([...data]);
  };
  const formatInputValue = () => {
    if (!dataQuotation?.dateOfBirth) return '';
    return `${dataQuotation?.dateOfBirth?.day} ${getMonthName(
      dataQuotation?.dateOfBirth?.month
    )} ${dataQuotation?.dateOfBirth?.year}`;
  };

  const renderCustomInput = ({ ref, value, onClick, ...props }) => {
    const data = [...dataQuotation];
    // console.log(data[value].dateOfBirth);
    // console.log('valss', value);
    return (
      <>
        {console.log('test', ref, value, onClick)}
        <FormControl
          variant="floating"
          id="first-name"
          isRequired
          fontFamily={'Mulish'}
        >
          <InputGroup id="float-labelss">
            <Input
              style={{ paddingTop: '12px' }}
              className="global-input"
              readOnly
              ref={ref}
              placeholder=" "
              _placeholder={{ opacity: 1, color: 'gray.500' }}
              value={
                data[value].dateOfBirth
                  ? `${data[value].dateOfBirth.day} ${getMonthName(
                      data[value]?.dateOfBirth?.month
                    )} ${data[value].dateOfBirth.year}`
                  : ''
              }
              onClick={onClick}
              h="48px"
              {...props}
            />
            <InputRightElement children={<SlCalender color="green.500" />} />
            <FormLabel
              // fontSize="12"
              pt="1.5"
              style={{
                textAlign: 'center',
                position: 'absolute',
                color: data[value].dateOfBirth !== null ? '#065baa' : '',
                transform:
                  data[value].dateOfBirth !== null
                    ? 'translateY(0px)'
                    : 'translateY(17px)',
              }}
              fontFamily={'Mulish'}
              // fontSize="11px"
              // fontStyle="italic"
              className="floating-label-global"
            >
              Date Of Birth
            </FormLabel>
          </InputGroup>
          {/* It is important that the Label comes after the Control due to css selectors */}
        </FormControl>
      </>
    );
  };

  const customStyles = {
    // Custom styles for the menu
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Set the z-index to a high value
    }),
    // You can add more custom styles for other parts of the Select component here
  };

  const handleBack = () => {
    navigate(-1);
  };

  let content;
  if (isLoading || loadingDownload || loadingView) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (isSuccess || isSuccessDownload || isSuccessView) {
    content = (
      <>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt="4em"
        >
          <Box
            display="flex"
            justifyContent={'space-between'}
            w="100%"
            borderBottom="1px"
            borderColor={'#ebebeb'}
            mb="1em"
          >
            <Box w="100%" pt="15px">
              <Breadcrumb
                spacing="8px"
                pl="1em"
                separator={<ChevronRightIcon color="gray.500" />}
              >
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink as={NavLink} to="/policies/list">
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
                      Sales Directory
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink as={NavLink} onClick={handleBack}>
                    <Text as={'p'} color="#065BAA" fontSize={'sm'}>
                      {policyNumberString === undefined
                        ? quotation?.travellers[0]?.policyNumber
                        : policyNumberString}
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    as={NavLink}
                    to="#"
                    style={{ pointerEvents: 'none' }}
                  >
                    <Text as={'p'} fontSize={'sm'} color="#231F20">
                      Update
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>
          </Box>
        </Box>
        <Box border={'1px'} borderColor="#ebebeb" m="auto" w="80%">
          <Box display={'flex'} justifyContent={'space-between'} m="1em">
            <Box w="100%" p="1em">
              {quotation?.travellerType?.name === 'Individual'
                ? dataQuotation
                  ? dataQuotation
                      .filter(
                        (policy) => policy.policyNumber === policyNumberString
                      )
                      .map((travellers, i) => {
                        return (
                          <Box key={i} mt="1em">
                            <Accordion allowMultiple>
                              <AccordionItem
                                border={'1px solid #ebebeb'}
                                borderRadius={'5px'}
                              >
                                <h2 style={{ marginBottom: '0', p: '10px' }}>
                                  <Box as="div" role="group">
                                    <AccordionButton
                                      style={{ height: '40px' }}
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
                                    </AccordionButton>
                                  </Box>
                                </h2>
                                <Box>
                                  <AccordionPanel
                                    pb={4}
                                    style={{ overflowX: 'scroll' }}
                                  >
                                    <Box display={'flex'} gap="5px" mb="1em">
                                      <FormControl
                                        variant="floating"
                                        isRequired
                                        fontFamily={'Mulish'}
                                        mt="14px"
                                      >
                                        <Box className="floating-form" w="100%">
                                          <Box className="react-select-container">
                                            <Select
                                              menuPortalTarget={document.body}
                                              style={{
                                                backgroundColor:
                                                  travellers?.type?.length !== 0
                                                    ? '#e8f0fe'
                                                    : '#ebebeb',
                                              }}
                                              isMulti={false}
                                              name="colors"
                                              onChange={(selectedOption) =>
                                                handleSelectType(
                                                  selectedOption,
                                                  i
                                                )
                                              }
                                              value={travellers?.type}
                                              // classNamePrefix="chakra-react-select"
                                              classNamePrefix={
                                                travellers?.type?.length !== 0
                                                  ? 'chakra-react-select-default'
                                                  : 'chakra-react-select'
                                              }
                                              options={types}
                                              placeholder=""
                                              closeMenuOnSelect={true}
                                              chakraStyles={{
                                                dropdownIndicator: (
                                                  prev,
                                                  {
                                                    selectProps: { menuIsOpen },
                                                  }
                                                ) => ({
                                                  ...prev,
                                                  '> svg': {
                                                    transitionDuration:
                                                      'normal',
                                                    transform: `rotate(${
                                                      menuIsOpen ? -180 : 0
                                                    }deg)`,
                                                  },
                                                }),
                                              }}
                                            />
                                            <span className="highlight"></span>
                                            <FormLabel
                                              pt="1.5"
                                              style={{
                                                transform:
                                                  travellers &&
                                                  travellers?.type?.length > 0
                                                    ? 'translate(0, 13px) scale(0.75)'
                                                    : 'translate(0, 4px) scale(0.75)',
                                                color:
                                                  travellers &&
                                                  travellers?.type?.length > 0
                                                    ? '#065baa'
                                                    : '#231F20',
                                                // fontSize: '14px',
                                              }}
                                              className="floating-label-global"
                                              fontFamily={'Mulish'}
                                            >
                                              Traveller Type
                                            </FormLabel>
                                          </Box>
                                        </Box>
                                        {/* It is important that the Label comes after the Control due to css selectors */}
                                      </FormControl>

                                      <FormControl
                                        variant="floating"
                                        isRequired
                                        fontFamily={'Mulish'}
                                        mt="14px"
                                      >
                                        <Box className="floating-form" w="100%">
                                          <Box className="react-select-container">
                                            <Select
                                              style={{
                                                backgroundColor:
                                                  travellers?.label !== null
                                                    ? '#e8f0fe'
                                                    : '#ebebeb',
                                              }}
                                              isMulti={false}
                                              name="colors"
                                              onChange={(selectedOption) =>
                                                handleSelectTitle(
                                                  selectedOption,
                                                  i
                                                )
                                              }
                                              value={travellers?.label}
                                              classNamePrefix={
                                                travellers?.label?.length > 0
                                                  ? 'chakra-react-select-default'
                                                  : 'chakra-react-select'
                                              }
                                              options={titles}
                                              placeholder=""
                                              closeMenuOnSelect={true}
                                              styles={customStyles}
                                              chakraStyles={{
                                                dropdownIndicator: (
                                                  prev,
                                                  {
                                                    selectProps: { menuIsOpen },
                                                  }
                                                ) => ({
                                                  ...prev,
                                                  '> svg': {
                                                    transitionDuration:
                                                      'normal',
                                                    transform: `rotate(${
                                                      menuIsOpen ? -180 : 0
                                                    }deg)`,
                                                  },
                                                }),
                                              }}
                                            />
                                            <span className="highlight"></span>
                                            <FormLabel
                                              pt="1.5"
                                              style={{
                                                transform:
                                                  travellers &&
                                                  travellers?.label?.length > 0
                                                    ? 'translate(0, 13px) scale(0.75)'
                                                    : 'translate(0, 4px) scale(0.75)',
                                                color:
                                                  travellers &&
                                                  travellers?.label?.length > 0
                                                    ? '#065baa'
                                                    : '#231F20',
                                                // fontSize: '14px',
                                              }}
                                              className="floating-label-global"
                                              fontFamily={'Mulish'}
                                            >
                                              Title
                                            </FormLabel>
                                          </Box>
                                        </Box>
                                        {/* It is important that the Label comes after the Control due to css selectors */}
                                      </FormControl>
                                    </Box>
                                    <Box display={'flex'} gap="5px">
                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        style={{
                                          textAlign: 'center',
                                        }}
                                        position={'relative'}
                                        zIndex={0}
                                        height="100%"
                                      >
                                        <FormLabel
                                          fontSize="11px"
                                          fontStyle={'italic'}
                                          pt="10px"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.firstName !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.firstName !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(17px)',
                                          }}
                                          // top={'20px'}
                                          // style={{}}
                                          className="floating-label-global"
                                        >
                                          FirstName
                                        </FormLabel>
                                        <Input
                                          isDisabled={true}
                                          className="global-input"
                                          variant="custom"
                                          pt="10px"
                                          placeholder=" "
                                          bg={
                                            travellers?.firstName !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          name="firstName"
                                          value={travellers?.firstName}
                                          onChange={(e) => setFirstName(e, i)}
                                          h="48px"
                                        />
                                      </FormControl>
                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        position={'relative'}
                                        zIndex={0}
                                      >
                                        <Input
                                          isDisabled={true}
                                          className="global-input"
                                          variant={'custom'}
                                          pt="10px"
                                          placeholder=" "
                                          bg={
                                            travellers?.lastName !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          name="lastName"
                                          value={travellers?.lastName}
                                          onChange={(e) => setLastName(e, i)}
                                          h="48px"
                                        />
                                        {/* It is important that the Label comes after the Control due to css selectors */}
                                        <FormLabel
                                          fontSize="11"
                                          pt="1.5"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.lastName !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.lastName !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(17px)',
                                          }}
                                          className="floating-label-global"
                                        >
                                          LastName
                                        </FormLabel>
                                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                                      </FormControl>
                                    </Box>
                                    <Box pt="7px">
                                      <Text
                                        as="p"
                                        fontFamily={'Mulish'}
                                        color="#065BAA"
                                        pl="5px"
                                        style={{ fontSize: '12px' }}
                                      >
                                        As on ID Card/passport/driving license
                                        (without degree or special characters)
                                      </Text>
                                    </Box>
                                    <Box
                                      display={'flex'}
                                      gap="5px"
                                      mt="10px"
                                      bg={
                                        travellers?.dateOfBirth !== null
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                    >
                                      <DatePicker
                                        value={travellers.dateOfBirth}
                                        onChange={(date) =>
                                          setSelectedDates(date, i)
                                        }
                                        calendarPopperPosition="bottom"
                                        inputPlaceholder="Select a date" // placeholder
                                        formatInputText={formatInputValue}
                                        inputClassName="my-custom-inputs" // custom class
                                        renderInput={(renderProps) =>
                                          renderCustomInput({
                                            ...renderProps,
                                            value: i,
                                          })
                                        }
                                        shouldHighlightWeekends
                                        style={{
                                          fontSize: '12px',
                                          fontfamily: 'Mulish',
                                          marginTop: '1em',
                                          color: '#000000ad',
                                          zIndex: 0,
                                        }}
                                      />

                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        style={{
                                          textAlign: 'center',
                                        }}
                                        height="100%"
                                      >
                                        <FormLabel
                                          fontSize="11px"
                                          fontStyle={'italic'}
                                          pt="10px"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.placeOfBirth !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.placeOfBirth !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(17px)',
                                          }}
                                          className="floating-label-global"
                                          // top={'20px'}
                                          // style={{}}
                                        >
                                          Place Of Birth
                                        </FormLabel>
                                        <Input
                                          className="global-input"
                                          variant="custom"
                                          pt="10px"
                                          placeholder=" "
                                          bg={
                                            travellers?.placeOfBirth !== ''
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          // name=""
                                          value={travellers?.placeOfBirth}
                                          onChange={(e) =>
                                            setPlaceOfBirth(e, i)
                                          }
                                          h="48px"
                                        />
                                      </FormControl>
                                    </Box>
                                    <Box w={{ base: '100%' }} pb="10px">
                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        fontFamily={'Mulish'}
                                        // mt="14px"
                                      >
                                        <Textarea
                                          bg={
                                            travellers?.address !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          placeholder=" "
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          value={travellers?.address}
                                          style={{
                                            fontSize: '12px',
                                            fontfamily: 'Mulish',
                                            marginTop: '1em',
                                            paddingTop: '2em',
                                            color: '#000000ad',
                                          }}
                                          onChange={(e) => setAddresss(e, i)}
                                          h="48px"
                                        />
                                        <FormLabel
                                          fontSize="12"
                                          pt="1.5"
                                          // className={isActive ? 'Active' : ''}
                                          fontFamily={'Mulish'}
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.address !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.address !== ''
                                                ? 'translateY(4px)'
                                                : 'translateY(17px)',
                                          }}
                                          className="floating-label-global"
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
                                        style={{
                                          textAlign: 'center',
                                        }}
                                        height="100%"
                                      >
                                        <FormLabel
                                          fontSize="11px"
                                          fontStyle={'italic'}
                                          pt="10px"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.email !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.email !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(17px)',
                                          }}
                                          // top={'20px'}
                                          // style={{}}
                                          className="floating-label-global"
                                        >
                                          Email
                                        </FormLabel>
                                        <Input
                                          className="global-input"
                                          variant="custom"
                                          pt="10px"
                                          placeholder=" "
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          name="email"
                                          value={travellers?.email}
                                          onChange={(e) =>
                                            setEmailAddress(e, i)
                                          }
                                          bg={
                                            travellers?.email !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          h="48px"
                                        />
                                      </FormControl>
                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        style={{
                                          textAlign: 'center',
                                        }}
                                        height="100%"
                                      >
                                        <FormLabel
                                          fontSize="11px"
                                          fontStyle={'italic'}
                                          pt="10px"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.phone !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.phone !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(17px)',
                                          }}
                                          // top={'20px'}
                                          // style={{}}
                                          className="floating-label-global"
                                        >
                                          Phone Number
                                        </FormLabel>
                                        <Input
                                          className="global-input"
                                          variant="custom"
                                          pt="10px"
                                          placeholder=" "
                                          bg={
                                            travellers?.phone !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          name="phone"
                                          value={travellers?.phone}
                                          onChange={(e) =>
                                            setPhoneNumbers(e, i)
                                          }
                                          h="48px"
                                        />
                                      </FormControl>
                                      <FormErrorMessage>
                                        {!isValid && (
                                          <span>Invalid Phone Address</span>
                                        )}
                                      </FormErrorMessage>
                                    </Box>
                                    <Box
                                      display={'flex'}
                                      gap="5px"
                                      mt="10px"
                                      alignItems={'center'}
                                    >
                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        style={{
                                          textAlign: 'center',
                                        }}
                                        height="100%"
                                      >
                                        <FormLabel
                                          fontSize="11px"
                                          fontStyle={'italic'}
                                          pt="10px"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.passport !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.passport !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(17px)',
                                          }}
                                          // top={'20px'}
                                          // style={{}}
                                          className="floating-label-global"
                                        >
                                          Identity Card/ Passport
                                        </FormLabel>
                                        <Input
                                          className="global-input"
                                          bg={
                                            travellers?.passport !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          variant="custom"
                                          pt="10px"
                                          placeholder=" "
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          name="passport"
                                          value={travellers?.passport}
                                          onChange={(e) => setPassport(e, i)}
                                          h="48px"
                                        />
                                      </FormControl>

                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        style={{
                                          textAlign: 'center',
                                        }}
                                        height="100%"
                                      >
                                        <FormLabel
                                          // fontSize="11px"
                                          fontStyle={'italic'}
                                          pt="10px"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.ticket !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.ticket !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(-3px)',
                                          }}
                                          // top={'20px'}
                                          // style={{}}
                                          className="floating-label-global"
                                        >
                                          Ticket Number
                                        </FormLabel>
                                        <Input
                                          className="global-input"
                                          variant="custom"
                                          bg={
                                            travellers?.ticket !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          placeholder=" "
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          name="ticket"
                                          value={travellers?.ticket}
                                          onChange={(e) => setTicket(e, i)}
                                          h="48px"
                                        />
                                      </FormControl>
                                    </Box>
                                    <Box
                                      display={'flex'}
                                      gap="5px"
                                      alignItems={'center'}
                                    >
                                      <FormControl
                                        variant="floating"
                                        id="first-name"
                                        isRequired
                                        style={{
                                          textAlign: 'center',
                                        }}
                                        height="100%"
                                      >
                                        <FormLabel
                                          // fontSize="11px"
                                          fontStyle={'italic'}
                                          pt="10px"
                                          style={{
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color:
                                              travellers?.beneficiary !== ''
                                                ? '#065baa'
                                                : '',
                                            transform:
                                              travellers?.beneficiary !== ''
                                                ? 'translateY(-10px)'
                                                : 'translateY(-3px)',
                                          }}
                                          // top={'20px'}
                                          // style={{}}
                                          className="floating-label-global"
                                        >
                                          Beneficiary
                                        </FormLabel>
                                        <Input
                                          className="global-input"
                                          variant="custom"
                                          pt="10px"
                                          bg={
                                            travellers?.beneficiary !== null
                                              ? '#e8f0fe'
                                              : '#ebebeb'
                                          }
                                          placeholder=" "
                                          _placeholder={{
                                            opacity: 1,
                                            color: 'gray.500',
                                          }}
                                          name="beneficiary"
                                          value={travellers?.beneficiary}
                                          onChange={(e) => setBeneficiary(e, i)}
                                          h="48px"
                                        />
                                      </FormControl>
                                      <FormControl
                                        variant="floating"
                                        isRequired
                                        fontFamily={'Mulish'}
                                        // mt="14px"
                                      >
                                        <Box className="floating-form" w="100%">
                                          <Box className="react-select-container">
                                            <Select
                                              style={{
                                                backgroundColor:
                                                  travellers?.relations !== null
                                                    ? '#e8f0fe'
                                                    : '#ebebeb',
                                              }}
                                              isMulti={false}
                                              name="colors"
                                              onChange={(selectedOption) =>
                                                handleSelectRelations(
                                                  selectedOption,
                                                  i
                                                )
                                              }
                                              value={travellers?.relations}
                                              // classNamePrefix="chakra-react-select"
                                              classNamePrefix={
                                                travellers?.relations
                                                  ?.length !== 0
                                                  ? 'chakra-react-select-default'
                                                  : 'chakra-react-select'
                                              }
                                              options={relations}
                                              placeholder=""
                                              closeMenuOnSelect={true}
                                              chakraStyles={{
                                                dropdownIndicator: (
                                                  prev,
                                                  {
                                                    selectProps: { menuIsOpen },
                                                  }
                                                ) => ({
                                                  ...prev,
                                                  '> svg': {
                                                    transitionDuration:
                                                      'normal',
                                                    transform: `rotate(${
                                                      menuIsOpen ? -180 : 0
                                                    }deg)`,
                                                  },
                                                }),
                                              }}
                                            />
                                            <span className="highlight"></span>
                                            <FormLabel
                                              pt="1.5"
                                              style={{
                                                transform:
                                                  travellers &&
                                                  travellers?.relations
                                                    ?.length !== 0
                                                    ? 'translate(3px, -2px) scale(0.75)'
                                                    : 'translate(0, 4px) scale(0.75)',
                                                color:
                                                  travellers &&
                                                  travellers?.relations
                                                    ?.length !== 0
                                                    ? '#065baa'
                                                    : '#231F20',
                                                // fontSize: '14px',
                                              }}
                                              className="floating-label-global"
                                              fontFamily={'Mulish'}
                                            >
                                              Relationship
                                            </FormLabel>
                                          </Box>
                                        </Box>
                                        {/* It is important that the Label comes after the Control due to css selectors */}
                                      </FormControl>
                                    </Box>
                                  </AccordionPanel>
                                </Box>
                              </AccordionItem>
                            </Accordion>
                          </Box>
                        );
                      })
                  : null
                : dataQuotation &&
                  dataQuotation?.map((travellers, i) => {
                    return (
                      <Box key={i} mt="1em">
                        <Accordion allowMultiple>
                          <AccordionItem
                            border={'1px solid #ebebeb'}
                            borderRadius={'5px'}
                          >
                            <h2 style={{ marginBottom: '0', p: '110pxem' }}>
                              <Box as="div" role="group">
                                <AccordionButton
                                  style={{ height: '40px' }}
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
                                </AccordionButton>
                              </Box>
                            </h2>
                            <Box>
                              <AccordionPanel
                                pb={4}
                                style={{ overflowX: 'scroll' }}
                              >
                                <Box display={'flex'} gap="5px" mb="1em">
                                  <FormControl
                                    variant="floating"
                                    isRequired
                                    fontFamily={'Mulish'}
                                    mt="14px"
                                  >
                                    <Box className="floating-form" w="100%">
                                      <Box className="react-select-container">
                                        <Select
                                          menuPortalTarget={document.body}
                                          style={{
                                            backgroundColor:
                                              travellers?.type?.length !== 0
                                                ? '#e8f0fe'
                                                : '#ebebeb',
                                          }}
                                          isMulti={false}
                                          name="colors"
                                          onChange={(selectedOption) =>
                                            handleSelectType(selectedOption, i)
                                          }
                                          value={travellers?.type}
                                          classNamePrefix={
                                            travellers?.type?.length > 0
                                              ? 'chakra-react-select-default'
                                              : 'chakra-react-select'
                                          }
                                          options={types}
                                          placeholder=""
                                          closeMenuOnSelect={true}
                                          chakraStyles={{
                                            dropdownIndicator: (
                                              prev,
                                              { selectProps: { menuIsOpen } }
                                            ) => ({
                                              ...prev,
                                              '> svg': {
                                                transitionDuration: 'normal',
                                                transform: `rotate(${
                                                  menuIsOpen ? -180 : 0
                                                }deg)`,
                                              },
                                            }),
                                          }}
                                        />
                                        <span className="highlight"></span>
                                        <FormLabel
                                          pt="1.5"
                                          style={{
                                            transform:
                                              travellers &&
                                              travellers?.type?.length > 0
                                                ? 'translate(0, 13px) scale(0.75)'
                                                : 'translate(0, 4px) scale(0.75)',
                                            color:
                                              travellers &&
                                              travellers?.type?.length > 0
                                                ? '#065baa'
                                                : '#231F20',
                                            fontSize: '14px',
                                          }}
                                          fontFamily={'Mulish'}
                                          className="floating-label-global"
                                        >
                                          Traveller Type
                                        </FormLabel>
                                      </Box>
                                    </Box>
                                    {/* It is important that the Label comes after the Control due to css selectors */}
                                  </FormControl>

                                  <FormControl
                                    variant="floating"
                                    isRequired
                                    fontFamily={'Mulish'}
                                    mt="14px"
                                  >
                                    <Box className="floating-form" w="100%">
                                      <Box className="react-select-container">
                                        <Select
                                          style={{
                                            backgroundColor:
                                              travellers?.label?.length !== 0
                                                ? '#e8f0fe'
                                                : '#ebebeb',
                                          }}
                                          isMulti={false}
                                          name="colors"
                                          onChange={(selectedOption) =>
                                            handleSelectTitle(selectedOption, i)
                                          }
                                          value={travellers?.label}
                                          classNamePrefix={
                                            travellers?.label?.length > 0
                                              ? 'chakra-react-select-default'
                                              : 'chakra-react-select'
                                          }
                                          options={titles}
                                          placeholder=""
                                          closeMenuOnSelect={true}
                                          styles={customStyles}
                                          chakraStyles={{
                                            dropdownIndicator: (
                                              prev,
                                              { selectProps: { menuIsOpen } }
                                            ) => ({
                                              ...prev,
                                              '> svg': {
                                                transitionDuration: 'normal',
                                                transform: `rotate(${
                                                  menuIsOpen ? -180 : 0
                                                }deg)`,
                                              },
                                            }),
                                          }}
                                        />
                                        <span className="highlight"></span>
                                        <FormLabel
                                          pt="1.5"
                                          style={{
                                            transform:
                                              travellers &&
                                              travellers?.label?.length > 0
                                                ? 'translate(0, 13px) scale(0.75)'
                                                : 'translate(0, 4px) scale(0.75)',
                                            color:
                                              travellers &&
                                              travellers?.label?.length > 0
                                                ? '#065baa'
                                                : '#231F20',
                                            // fontSize: '11px',
                                          }}
                                          className="floating-label-global"
                                          fontFamily={'Mulish'}
                                        >
                                          Title
                                        </FormLabel>
                                      </Box>
                                    </Box>
                                    {/* It is important that the Label comes after the Control due to css selectors */}
                                  </FormControl>
                                </Box>
                                <Box display={'flex'} gap="5px">
                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    position={'relative'}
                                    zIndex={0}
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    height="100%"
                                  >
                                    <FormLabel
                                      fontSize="11px"
                                      fontStyle={'italic'}
                                      pt="10px"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.firstName !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.firstName !== ''
                                            ? 'translateY(-10px)'
                                            : 'translateY(17px)',
                                      }}
                                      // top={'20px'}
                                      // style={{}}
                                      className="floating-label-global"
                                    >
                                      FirstName
                                    </FormLabel>
                                    <Input
                                      isDisabled={true}
                                      className="global-input"
                                      variant="custom"
                                      pt="10px"
                                      placeholder=" "
                                      bg={
                                        travellers?.firstName !== ''
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      name="firstName"
                                      value={travellers?.firstName}
                                      onChange={(e) => setFirstName(e, i)}
                                      h="48px"
                                    />
                                  </FormControl>
                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    position={'relative'}
                                    zIndex={0}
                                  >
                                    <Input
                                      isDisabled={true}
                                      className="global-input"
                                      variant={'custom'}
                                      pt="10px"
                                      placeholder=" "
                                      bg={
                                        travellers?.lastName !== null
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      name="lastName"
                                      value={travellers?.lastName}
                                      onChange={(e) => setLastName(e, i)}
                                      h="48px"
                                    />
                                    {/* It is important that the Label comes after the Control due to css selectors */}
                                    <FormLabel
                                      fontSize="11"
                                      pt="1.5"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.lastName !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.lastName !== ''
                                            ? 'translateY(-10px)'
                                            : 'translateY(17px)',
                                      }}
                                      className="floating-label-global"
                                    >
                                      LastName
                                    </FormLabel>
                                    {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                                  </FormControl>
                                </Box>
                                <Box pt="7px">
                                  <Text
                                    as="p"
                                    fontFamily={'Mulish'}
                                    color="#065BAA"
                                    pl="5px"
                                    style={{ fontSize: '12px' }}
                                  >
                                    As on ID Card/passport/driving license
                                    (without degree or special characters)
                                  </Text>
                                </Box>
                                <Box
                                  display={'flex'}
                                  gap="5px"
                                  mt="10px"
                                  bg={
                                    travellers?.dateOfBirth !== null
                                      ? '#e8f0fe'
                                      : '#ebebeb'
                                  }
                                >
                                  <DatePicker
                                    value={travellers.dateOfBirth}
                                    onChange={(date) =>
                                      setSelectedDates(date, i)
                                    }
                                    calendarPopperPosition="bottom"
                                    inputPlaceholder="Select a date" // placeholder
                                    formatInputText={formatInputValue}
                                    inputClassName="my-custom-inputs" // custom class
                                    renderInput={(renderProps) =>
                                      renderCustomInput({
                                        ...renderProps,
                                        value: i,
                                      })
                                    }
                                    shouldHighlightWeekends
                                    style={{
                                      fontSize: '12px',
                                      fontfamily: 'Mulish',
                                      marginTop: '1em',
                                      color: '#000000ad',
                                      zIndex: 0,
                                    }}
                                  />

                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    height="100%"
                                  >
                                    <FormLabel
                                      fontSize="11px"
                                      fontStyle={'italic'}
                                      pt="10px"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',

                                        color:
                                          travellers?.placeOfBirth !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.placeOfBirth !== ''
                                            ? 'translateY(-1px)'
                                            : 'translateY(-9px)',
                                      }}
                                      // top={'20px'}
                                      // style={{}}
                                      className="floating-label-global"
                                    >
                                      Place Of Birth
                                    </FormLabel>
                                    <Input
                                      variant="custom"
                                      pt="10px"
                                      placeholder=" "
                                      className="global-input"
                                      bg={
                                        travellers?.placeOfBirth !== ''
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      // name=""
                                      value={travellers?.placeOfBirth}
                                      onChange={(e) => setPlaceOfBirth(e, i)}
                                      h="48px"
                                    />
                                  </FormControl>
                                </Box>
                                <Box w={{ base: '100%' }} pb="10px">
                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    fontFamily={'Mulish'}
                                    // mt="14px"
                                  >
                                    <Textarea
                                      bg={
                                        travellers?.address !== ''
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      placeholder=" "
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      value={travellers?.address}
                                      style={{
                                        fontSize: '12px',
                                        fontfamily: 'Mulish',
                                        marginTop: '1em',
                                        paddingTop: '2em',
                                        color: '#000000ad',
                                      }}
                                      onChange={(e) => setAddresss(e, i)}
                                      h="48px"
                                    />
                                    <FormLabel
                                      fontSize="12"
                                      pt="1.5"
                                      // className={isActive ? 'Active' : ''}
                                      fontFamily={'Mulish'}
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.address !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.address !== ''
                                            ? 'translateY(4px)'
                                            : 'translateY(17px)',
                                      }}
                                      className="floating-label-global"
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
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    height="100%"
                                  >
                                    <FormLabel
                                      fontSize="11px"
                                      fontStyle={'italic'}
                                      pt="10px"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.email !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.email !== ''
                                            ? 'translateY(-10px)'
                                            : 'translateY(17px)',
                                      }}
                                      // top={'20px'}
                                      // style={{}}
                                      className="floating-label-global"
                                    >
                                      Email
                                    </FormLabel>
                                    <Input
                                      variant="custom"
                                      pt="10px"
                                      placeholder=" "
                                      className="global-input"
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      name="email"
                                      value={travellers?.email}
                                      onChange={(e) => setEmailAddress(e, i)}
                                      bg={
                                        travellers?.email !== null
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      h="48px"
                                    />
                                  </FormControl>
                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    height="100%"
                                  >
                                    <FormLabel
                                      fontSize="11px"
                                      fontStyle={'italic'}
                                      pt="10px"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.phone !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.phone !== ''
                                            ? 'translateY(-10px)'
                                            : 'translateY(17px)',
                                      }}
                                      // top={'20px'}
                                      // style={{}}
                                      className="floating-label-global"
                                    >
                                      Phone Number
                                    </FormLabel>
                                    <Input
                                      variant="custom"
                                      pt="10px"
                                      placeholder=" "
                                      className="global-input"
                                      bg={
                                        travellers?.phone !== null
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      name="phone"
                                      value={travellers?.phone}
                                      onChange={(e) => setPhoneNumbers(e, i)}
                                      h="48px"
                                    />
                                  </FormControl>
                                  <FormErrorMessage>
                                    {!isValid && (
                                      <span>Invalid Phone Address</span>
                                    )}
                                  </FormErrorMessage>
                                </Box>
                                <Box display={'flex'} gap="5px" mt="10px">
                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    height="100%"
                                  >
                                    <FormLabel
                                      fontSize="11px"
                                      fontStyle={'italic'}
                                      pt="10px"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.passport !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.passport !== ''
                                            ? 'translateY(-10px)'
                                            : 'translateY(17px)',
                                      }}
                                      // top={'20px'}
                                      // style={{}}
                                      className="floating-label-global"
                                    >
                                      Identity Card/ Passport
                                    </FormLabel>
                                    <Input
                                      bg={
                                        travellers?.passport !== null
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      variant="custom"
                                      className="global-input"
                                      pt="10px"
                                      placeholder=" "
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      name="passport"
                                      value={travellers?.passport}
                                      onChange={(e) => setPassport(e, i)}
                                      h="48px"
                                    />
                                  </FormControl>

                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    height="100%"
                                  >
                                    <FormLabel
                                      fontSize="11px"
                                      fontStyle={'italic'}
                                      pt="10px"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.ticket !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.ticket !== ''
                                            ? 'translateY(-10px)'
                                            : 'translateY(17px)',
                                      }}
                                      // top={'20px'}
                                      // style={{}}
                                      className="floating-label-global"
                                    >
                                      Ticket Number
                                    </FormLabel>
                                    <Input
                                      bg={
                                        travellers?.ticket !== null
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      variant="custom"
                                      className="global-input"
                                      pt="10px"
                                      placeholder=" "
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      name="ticket"
                                      value={travellers?.ticket}
                                      onChange={(e) => setTicket(e, i)}
                                      h="48px"
                                    />
                                  </FormControl>
                                </Box>
                                <Box display={'flex'} gap="5px" mt="10px">
                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    isRequired
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    height="100%"
                                  >
                                    <FormLabel
                                      fontSize="11px"
                                      fontStyle={'italic'}
                                      pt="10px"
                                      style={{
                                        textAlign: 'center',
                                        position: 'absolute',
                                        color:
                                          travellers?.beneficiary !== ''
                                            ? '#065baa'
                                            : '',
                                        transform:
                                          travellers?.beneficiary !== ''
                                            ? 'translateY(-10px)'
                                            : 'translateY(-3px)',
                                      }}
                                      // top={'20px'}
                                      // style={{}}
                                      className="floating-label-global"
                                    >
                                      Beneficiary
                                    </FormLabel>
                                    <Input
                                      variant="custom"
                                      pt="10px"
                                      bg={
                                        travellers?.beneficiary !== ''
                                          ? '#e8f0fe'
                                          : '#ebebeb'
                                      }
                                      placeholder=" "
                                      _placeholder={{
                                        opacity: 1,
                                        color: 'gray.500',
                                      }}
                                      name="beneficiary"
                                      value={travellers?.beneficiary}
                                      onChange={(e) => setBeneficiary(e, i)}
                                      h="48px"
                                    />
                                  </FormControl>
                                  <FormControl
                                    variant="floating"
                                    isRequired
                                    fontFamily={'Mulish'}
                                    mt="14px"
                                  >
                                    <Box className="floating-form" w="100%">
                                      <Box className="react-select-container">
                                        <Select
                                          style={{
                                            backgroundColor:
                                              travellers?.relationship === '' ||
                                              travellers?.relations?.length !==
                                                0
                                                ? '#e8f0fe'
                                                : '#ebebeb',
                                          }}
                                          isMulti={false}
                                          name="colors"
                                          onChange={(selectedOption) =>
                                            handleSelectRelations(
                                              selectedOption,
                                              i
                                            )
                                          }
                                          value={travellers?.relations}
                                          // classNamePrefix="chakra-react-select"
                                          classNamePrefix={
                                            travellers?.relations?.length !== 0
                                              ? 'chakra-react-select-default'
                                              : 'chakra-react-select'
                                          }
                                          options={relations}
                                          placeholder=""
                                          closeMenuOnSelect={true}
                                          chakraStyles={{
                                            dropdownIndicator: (
                                              prev,
                                              { selectProps: { menuIsOpen } }
                                            ) => ({
                                              ...prev,
                                              '> svg': {
                                                transitionDuration: 'normal',
                                                transform: `rotate(${
                                                  menuIsOpen ? -180 : 0
                                                }deg)`,
                                              },
                                            }),
                                          }}
                                        />
                                        <span className="highlight"></span>
                                        <FormLabel
                                          pt="1.5"
                                          style={{
                                            transform:
                                              travellers &&
                                              travellers?.relations?.length !==
                                                0
                                                ? 'translate(3, -2px) scale(0.75)'
                                                : 'translate(0, 4px) scale(0.75)',
                                            color:
                                              travellers?.relationship === '' ||
                                              (travellers &&
                                                travellers?.relations
                                                  ?.length !== 0)
                                                ? '#065baa'
                                                : '#231F20',
                                            // fontSize: '11px',
                                          }}
                                          fontFamily={'Mulish'}
                                          className="floating-label-global"
                                        >
                                          Relationship
                                        </FormLabel>
                                      </Box>
                                    </Box>
                                    {/* It is important that the Label comes after the Control due to css selectors */}
                                  </FormControl>
                                </Box>
                              </AccordionPanel>
                            </Box>
                          </AccordionItem>
                        </Accordion>
                      </Box>
                    );
                  })}
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            p="1em"
          >
            {' '}
            <Button
              variant={'outline'}
              onClick={handleUpdate}
              isLoading={isLoadingSubmit}
              isDisalbed={isLoadingSubmit ? true : false}
            >
              Update
            </Button>
          </Box>
        </Box>
      </>
    );
  } else if (isError || isErrorDownload || isErrorView) {
    content = <p>{'Something Wrong'}</p>;
  }
  return content;
};
export default PolicyDetail;
