/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import PageLoader from '../../../components/pageLoader';
import { motion } from 'framer-motion';
import { Navigate, useNavigate, useParams, NavLink } from 'react-router-dom';
import {
  Text,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl';
import {
  useGetBookingByIdQuery,
  useDownloadPolicyQuery,
  useDownloadProformaQuery,
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
import { setHistoryForm } from '../../auth/authSlice';
import DownloadProforma from './downloadProforma';

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
  const { id, policyNumberString } = useParams();
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [viewModal, setViewModal] = useState(false);
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
  const [onTriggerDownload, setOnTriggerDownload] = useState(true);
  const [onTriggerView, setOnTriggerView] = useState(true);
  const prevId = usePrevious(id);
  const { data, isLoading: proccedDownload } = useDownloadProformaQuery(id, {
    skip: onTriggerDownload,
  });
  React.useEffect(() => {
    if (prevId !== id) {
      dispatch(setHistoryForm(0));
    }
  }, [id]);

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
        idTraveller = `${id}/${quotation && quotation?.travellers[0].id}`;
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
    refetch: refetchDownload,
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
    setIsLoadingState(!isLoadingState);
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

  const callbackDownload = React.useCallback((data) => {
    downloadAndOpenPdfInNewTab(data);
    setOnTrigger(true);
    // setIsLoadingState(!isLoadingState);
  }, []);

  React.useEffect(() => {
    callbackDownload(downloadPolicy);
  }, [downloadPolicy]);

  React.useEffect(() => {
    if (!onTrigger) {
      refetchDownload();
      setIsLoadingState(!isLoadingState);
    }
  }, [onTrigger]);

  React.useEffect(() => {
    if (!onTrigger) {
      setIsLoadingState(true);
    } else {
      setIsLoadingState(false);
    }
  }, [onTrigger]);

  const downloadAndOpenPdfInNewTab = async (downloadPolicy) => {
    if (!downloadPolicy) {
      // console.error('PDF data is missing.');
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
      newTab.addEventListener(
        'beforeunload',
        () => {
          URL.revokeObjectURL(downloadPolicy);
        },
        1000
      );
    }
  };

  console.log(
    'onTrigger',
    policyNumberString,
    getTravellerId(policyNumberString)
  );
  console.log('quot', quotation);
  React.useEffect(() => {
    getTravellerId(policyNumberString);
  }, [policyNumberString, getTravellerId]);

  const handleEmailChange = (e) => {
    setCurrentEmail(e.target.value);
  };

  // console.log('policyNumberString', policyNumberString);
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

  const handleView = () => {
    setOnTriggerView(false);
    setViewModal(!viewModal);
    // setOnTrigger(true);
  };

  React.useEffect(() => {
    const maxWidth = window.innerWidth * (modalContentWidth / 100);
    setWidth(maxWidth);
  }, [viewModal]);

  const handleEditPolicy = () => {
    if (policyNumberString !== undefined) {
      navigate(`/policies/detail/update/${policyNumberString}/${id}`);
    } else {
      navigate(`/policies/detail/update/${id}`);
    }
  };

  const handleUpgrade = () => {
    navigate(`/upgrade-quote/search/${id}`);
  };

  // let cleanupPromise = Promise.resolve();

  const handleDownloadProforma = () => {
    setOnTriggerDownload(false);
    createNewTab();
  };

  const createNewTab = async (url) => {
    // Create a Promise to handle the new tab creation
    if (data) {
      const newTabPromise = new Promise((resolve) => {
        const newTab = window.open('', '_blank');
        if (!newTab) {
          console.error('Pop-up blocked');
          resolve(null);
        } else {
          resolve(newTab);
        }
      });

      // Wait for the new tab to open
      const newTab = await newTabPromise;

      if (newTab) {
        // Create an iframe element and set its source to the fetched data URL
        const iframe = document.createElement('iframe');
        iframe.src = url; // Assuming your response has a URL field
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        // Append the iframe to the new tab's document
        newTab.document.body.appendChild(iframe);
      }
    }
  };

  React.useEffect(() => {
    createNewTab(data);
  }, [data]);
  let content;
  if (isLoading || loadingDownload || loadingView || isLoadingState) {
    content = (
      <PageLoader
        loading={isLoading || loadingDownload || loadingView || isLoadingState}
      />
    );
  } else if (isSuccess || isSuccessDownload || isSuccessView) {
    content = (
      <motion.Box
        mt="4em"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1.1 }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          borderBottom="1px"
          borderColor={'#ebebeb'}
        >
          <Box
            display="flex"
            justifyContent={'space-between'}
            w="100%"
            // mt="4em"
          >
            <Box w="100%" pt="15px" mt="4em">
              <Breadcrumb
                spacing="8px"
                ml="1em"
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
                  <BreadcrumbLink
                    as={NavLink}
                    to="#"
                    style={{ pointerEvents: 'none' }}
                  >
                    <Text as={'b'} fontSize={'sm'} color="#231F20">
                      {policyNumberString === undefined
                        ? quotation?.travellers[0]?.policyNumber
                        : policyNumberString}
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>

            <Box
              display={'flex'}
              alignItems={'center'}
              gap="5px"
              mr="1em"
              mt="4em"
            >
              <Menu>
                {quotation?.statusSales === 'SUCCESS' ||
                quotation?.statusSales === null ? (
                  <MenuButton as={Button} colorScheme="white">
                    <FiMoreVertical color="#065BAA" size={'16px'} />
                  </MenuButton>
                ) : null}
                <MenuList>
                  <MenuItem onClick={handleUpgrade}>
                    <Box gap="5px" display={'flex'} alignItems="center">
                      <AiOutlineUpload color="#065BAA" size={'16px'} />
                      <Text as="p" fontSize="xs">
                        Upgrade
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleEditPolicy}>
                    <Box gap="5px" display={'flex'} alignItems="center">
                      <BiRefresh color="#065BAA" size={'16px'} />
                      <Text as="p" fontSize="xs">
                        Update
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={addEmail}>
                    <Box gap="5px" display={'flex'} alignItems="center">
                      <AiOutlineMail color="#065BAA" size={'16px'} />
                      <Text as="p" fontSize="xs">
                        Email
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleView}>
                    <Box gap="5px" display={'flex'} alignItems="center">
                      <AiOutlineFolderView color="#065BAA" size={'16px'} />
                      <Text as="p" fontSize="xs">
                        View
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleDownload}>
                    <Box gap="5px" display={'flex'} alignItems="center">
                      <AiOutlineDownload color="#065BAA" size={'16px'} />
                      <Text as="p" fontSize="xs">
                        Download
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleDownloadProforma}>
                    {/* <DownloadProforma id={id} /> */}
                    <Box gap="5px" display={'flex'} alignItems="center">
                      <AiOutlineDownload color="#065BAA" size={'16px'} />
                      <Text as="p" fontSize="xs">
                        Download Proforma Invoice
                      </Text>
                    </Box>
                  </MenuItem>
                  <MenuItem>
                    <Box gap="5px" display={'flex'} alignItems="center">
                      <BsCreditCard2Front color="#065BAA" size={'16px'} />
                      <Text as="p" fontSize="xs">
                        Edit Ticket Number
                      </Text>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>
              {/* <IconButton
              _hover={{ color: 'white' }}
              icon={<FiMoreVertical color="#065BAA" size={'16px'} />}
              bg="white"
              onClick={handleMenu}
            /> */}
              {/* <IconButton _hover={{color:"white"}} icon={ <CiTrash color="#065BAA" size={'16px'}/>} bg="white" border="1px solid #ebebeb" onClick={handleDeletAgent}/> */}
            </Box>
          </Box>
        </Box>
        <Box ml="2em" mr="2em">
          <Box display={'flex'} justifyContent={'space-between'} m="1em">
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                  <Box>
                    <EmailInput
                      quotation={quotation}
                      handleClose={handleClose}
                    />
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal isOpen={viewModal} onClose={setViewModal} size="full">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                  <Box>
                    <iframe
                      ref={iframeRef}
                      src={viewPolicy}
                      title="Embedded Content"
                      width="800px"
                      height="600px"
                      frameBorder="0"
                      onLoad={handleIframeLoad}
                      scrolling="no"
                    ></iframe>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Box w={{ base: '100%', md: '30%' }}>
              <Box
                display={'flex'}
                flexDirection={'column'}
                border={'1px solid #ebebeb'}
                mt="15 px"
                mr="10px"
                w="100%"
              >
                <Box bg="#F0F3F8" p="10px">
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                  >
                    {policyNumberString === undefined
                      ? quotation?.travellers[0]?.policyNumber
                      : policyNumberString}
                  </Text>
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
                    gap="1em"
                  >
                    <Image src={Files} alt="insurance" />
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      flexDirection={'column'}
                    >
                      <Text
                        as="b"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {'Booking Code'}
                      </Text>
                      <Text
                        as="p"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {quotation?.transactionId}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    boxSizing="borderBox"
                    borderBottom={'1px solid #ebebeb'}
                    pb="10px"
                    pt="10px"
                    gap="1em"
                  >
                    <Image src={Plan} alt="insurance" />
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      flexDirection={'column'}
                    >
                      <Text
                        as="b"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {'Travel Details'}
                      </Text>
                      <Text
                        as="p"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {`${
                          quotation?.coverType === 'SINGLE_TRIP'
                            ? 'Single Trip '
                            : 'Annual Trip'
                        }`}
                      </Text>
                      <Text
                        as="p"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {'Singapore'}
                      </Text>
                      <Text
                        as="p"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {`${formatDateToLong(
                          quotation?.from
                        )} - ${formatDateToLong(quotation?.to)}`}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    boxSizing="borderBox"
                    borderBottom={'1px solid #ebebeb'}
                    pb="10px"
                    pt="10px"
                    gap="1em"
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
                        style={{ fontSize: '12px' }}
                      >
                        {'Selected Plan'}
                      </Text>
                      <Box>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                          gap="1em"
                        >
                          {`${quotation?.selectProduct?.productName}`}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    boxSizing="borderBox"
                    borderBottom={'1px solid #ebebeb'}
                    pb="10px"
                    pt="10px"
                    gap="1em"
                  >
                    <Image src={Pasport} alt="insurance" />
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      flexDirection={'column'}
                    >
                      <Text
                        as="b"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {'Traveller Type'}
                      </Text>
                      <Box>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                          gap="1em"
                        >
                          {`${quotation?.travellerType?.name}`}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'flex-start'}
                    boxSizing="borderBox"
                    borderBottom={'1px solid #ebebeb'}
                    pb="10px"
                    pt="10px"
                    gap="1em"
                  >
                    <Image src={Payment} alt="insurance" />
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      flexDirection={'column'}
                      w="100%"
                    >
                      <Text
                        as="b"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        style={{ fontSize: '12px' }}
                      >
                        {'Payment Details'}
                      </Text>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Status'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {`${quotation?.paymentData?.paymentStatus}`}
                        </Text>
                      </Box>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Payment Code'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {quotation?.paymentData?.paymentId
                            ? quotation?.paymentData?.paymentId
                            : '-'}
                        </Text>
                      </Box>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Payment Method'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {`${quotation?.paymentData?.paymentMethod}`}
                        </Text>
                      </Box>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Premium price'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {`${quotation?.selectProduct?.finalPrice}`}
                        </Text>
                      </Box>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Quantity'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'x'}
                          {quotation?.travellers?.length}
                        </Text>
                      </Box>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Stamp Duty'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {quotation?.stampDuty}
                        </Text>
                      </Box>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Issued by'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {`${quotation?.sales?.firstName} ${quotation?.sales?.lastName}`}
                        </Text>
                      </Box>
                      <Box
                        w="100%"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        gap="1em"
                        borderBottom="1px solid #ebebeb"
                        pb="10px"
                        pt="5px"
                      >
                        <Text
                          as="b"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {'Purchase Date'}
                        </Text>
                        <Text
                          as="p"
                          size={'sm'}
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                        >
                          {`${formatDateToLong(
                            quotation?.paymentData?.successTimestamp
                          )}`}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box w="70%" pl="1em">
              <Box bg="white" w={{ base: '100%' }} p={{ md: '10px' }}>
                <Box
                  pb="10px"
                  pt="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  className="global-detail"
                >
                  <Text as="b" fontFamily={'Mulish'} color={'#231F20'}>
                    {'Policy Number'}
                  </Text>
                  <Box bg="#f0f3f8" p="2px" className="global-detail">
                    <Text as="p" fontFamily={'Mulish'} fontWeight={'400'}>
                      {policyNumberString === undefined
                        ? quotation?.travellers[0]?.policyNumber
                        : policyNumberString}
                    </Text>
                  </Box>
                </Box>
                <Box
                  pb="10px"
                  pt="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  className="global-detail"
                >
                  <Text as="b" fontFamily={'Mulish'} color={'#231F20'}>
                    {'Proforma Invoice'}
                  </Text>
                  <Box bg="#f0f3f8" p="2px" className="global-detail">
                    <Text as="p" fontFamily={'Mulish'} fontWeight={'400'}>
                      {quotation !== null ? quotation?.proformaRefNo : null}
                    </Text>
                  </Box>
                </Box>
                <Box
                  pb="10px"
                  pt="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  justifyContent={'center'}
                  className="global-detail"
                >
                  <Text as="b" fontFamily={'Mulish'} color={'#231F20'}>
                    {'Policy History'}
                  </Text>
                  <Box
                    p="2px"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    gap="5px"
                    flexDirection="column"
                    className="global-detail"
                  >
                    {quotation?.histories.map((history, i) => (
                      <Box
                        bg="#f0f3f8"
                        p={'0.2em'}
                        key={i}
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Box
                          w="8px"
                          h="8px"
                          bg="green"
                          borderRadius={'full'}
                          display="flex"
                          ml="5px"
                          className="global-detail"
                        />
                        <Text
                          p="10px"
                          as="p"
                          fontFamily={'Mulish'}
                          style={{ fontSize: '12px' }}
                          fontWeight={'400'}
                        >
                          {history.message}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              {quotation?.travellerType?.name === 'Individual'
                ? quotation?.travellers
                  ? quotation?.travellers
                      .filter(
                        (travellers) =>
                          travellers.policyNumber === policyNumberString
                      )
                      .map((travellers, i) => {
                        return (
                          <Box key={i} mt="1em">
                            <Accordion allowMultiple defaultIndex={[0]}>
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
                                    </AccordionButton>
                                  </Box>
                                </h2>
                                <Box>
                                  <AccordionPanel pb={4}>
                                    <Box
                                      display="flex"
                                      justifyContent="flex-start"
                                      alignItems="center"
                                      p={{ base: '4px', md: '10px' }}
                                      borderBottom={'1px solid #ebebeb'}
                                      borderRadius={'5px'}
                                    >
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Policy Number
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.policyNumber}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Traveller Type
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.travellerType}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Title
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.title}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Full Name
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {`${travellers?.firstName} ${travellers?.lastName}`}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Email Address
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.email}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Phone Number
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.phone}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Identitiy Card/ Passport
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.passport}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Ticket Number
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.ticket
                                            ? travellers?.ticket
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Date Of Birth
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {formatDateToLong(
                                            travellers?.dateOfBirth
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Place Of Birth
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.placeOfBirth}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Address
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.address}
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Beneficiary
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.beneficiary
                                            ? travellers?.beneficiary
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
                                      <Box
                                        w={{ md: '30%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="b"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                          color={'#231F20'}
                                        >
                                          Relationship
                                        </Text>
                                      </Box>
                                      <Box
                                        w={{ md: '70%' }}
                                        className="global-detail"
                                      >
                                        <Text
                                          as="p"
                                          size="sm"
                                          fontFamily={'Mulish'}
                                        >
                                          {travellers?.relationship
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
                      })
                  : null
                : quotation?.travellers.map((travellers, i) => {
                    return (
                      <Box key={i} mt="1em">
                        <Accordion allowMultiple defaultIndex={[0]}>
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
                                </AccordionButton>
                              </Box>
                            </h2>
                            <Box>
                              <AccordionPanel pb={4}>
                                <Box
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  p={{ base: '4px', md: '10px' }}
                                  borderBottom={'1px solid #ebebeb'}
                                  border="1px solid #ebebeb"
                                  borderRadius={'5px'}
                                >
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Policy Number
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.policyNumber}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Traveller Type
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.travellerType}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Title
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.title}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Full Name
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {`${travellers?.firstName} ${travellers?.lastName}`}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Email Address
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.email}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Phone Number
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.phone}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Identitiy Card/ Passport
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.passport}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Ticket Number
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.ticket}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Date Of Birth
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {formatDateToLong(
                                        travellers?.dateOfBirth
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Place Of Birth
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.placeOfBirth}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Address
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.address}
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Beneficiary
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.beneficiary
                                        ? travellers?.beneficiary
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
                                  <Box
                                    w={{ md: '30%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="b"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                      color={'#231F20'}
                                    >
                                      Relationship
                                    </Text>
                                  </Box>
                                  <Box
                                    w={{ md: '70%' }}
                                    className="global-detail"
                                  >
                                    <Text
                                      as="p"
                                      size="sm"
                                      fontFamily={'Mulish'}
                                    >
                                      {travellers?.relationship
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
            </Box>
          </Box>
        </Box>
      </motion.Box>
    );
  } else if (isError || isErrorDownload || isErrorView) {
    content = <p>{'Something Wrong'}</p>;
  }
  return content;
};
export default PolicyDetail;
