/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Text,
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
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl';
import { useGetBookingsQuotationQuery } from '../../dashboard/quota-search/policyApiSlice';
import Files from '../../../img/images/Files.png';
import Plan from '../../../img/images/Plane.png';
import Pasport from '../../../img/images/Passport.png';
import Umbrella from '../../../img/Umbrella.png';
import Payment from '../../../img/Payment.png';
import PaymentSuccessBg from '../../../img/images/Naturescape.png';
import { ArrowBackIcon } from '@chakra-ui/icons';

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
const PaymentSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isActive] = useState(false);
  // const { data: checkstatus, refetch, isSuccess } = useGetCheckPaymentQuery(id);
  const { data: quotation, refetch } = useGetBookingsQuotationQuery(id);
  // const [searchproducts, { isLoading }] = useSearchproductsMutation();
  const [isActives, setActives] = useState(false);
  // console.log('compre', hasCompletedAllSteps)
  // const [ManualInput, setManualInput] = React.useState({
  //    coverageType:"",
  //    travellerType:"",
  //    amount:"",
  //    destinationCountry:"",
  //    startDate:"",
  //    endDate:"",
  // })
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

  const handleRedirect = () => {
    navigate('/policies/list');
  };
  console.log('quotation', quotation);
  // console.log('isSuccess', isSuccess);
  return (
    <Box border={'1px'} borderColor="#ebebeb" mt="5em" ml="2em" mr="2em">
      <Box
        w={{ base: '100%', md: '100%' }}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        m="2em"
      >
        <Box>
          <Image src={PaymentSuccessBg} alt="Payment Success" />
        </Box>
        <Box>
          <Text
            as={'p'}
            fontSize="xs"
            style={{
              color: '#000015',
              fontFamily: 'Mulish',
              fontWeight: 'bold',
            }}
          >
            Policy Successfully Created!
          </Text>
          <Text
            as={'p'}
            fontSize="xs"
            style={{
              color: '#000015',
              fontFamily: 'Mulish',
              fontWeight: 'bold',
            }}
          >
            The policy has been successfully issued. Check your detail below
          </Text>
          <Button
            variant={'outline'}
            mt="10px"
            mb="10px"
            style={{
              fontFamily: 'Mulish',
              fontWeight: 'bold',
            }}
          >
            Email Booking Details
          </Button>
          <Box onClick={handleRedirect}>
            <Text
              as={'p'}
              fontSize="xs"
              color={'black.200'}
              style={{
                color: '#000015',
                cursor: 'pointer',
                fontFamily: 'Mulish',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              Go to Policy Directory
            </Text>
          </Box>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} m="1em">
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
                {`TRANSACTIONID : ${quotation?.transactionId}`}
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
                    color="#065BAA"
                    style={{ fontSize: '12px' }}
                  >
                    {'Singapore'}
                  </Text>
                  <Text
                    as="p"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    color="#065BAA"
                    style={{ fontSize: '12px' }}
                  >
                    {`${formatDateToLong(quotation?.from)} - ${formatDateToLong(
                      quotation?.to
                    )}`}
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
                      color="#065BAA"
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
                    {'Number of Travellers'}
                  </Text>
                  <Text
                    as="p"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {`${quotation?.travellers?.length}`}
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
                {/* <Image src={Payment} alt="insurance" /> */}
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
                      {`${quotation?.salesId?.firstName} ${quotation?.salesId?.lastName}`}
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
          {quotation?.travellers.map((travellers, i) => {
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
                          <Box w={{ md: '30%' }}>
                            <Text
                              as="b"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                              color={'#231F20'}
                            >
                              Policy Number
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
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
                          <Box w={{ md: '30%' }}>
                            <Text
                              as="b"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                              color={'#231F20'}
                            >
                              Traveller Type
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
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
                          <Box w={{ md: '30%' }}>
                            <Text
                              as="b"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                              color={'#231F20'}
                            >
                              Title
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
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
                          <Box w={{ md: '30%' }}>
                            <Text
                              as="b"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
                              color={'#231F20'}
                            >
                              Ticket Number
                            </Text>
                          </Box>
                          <Box w={{ md: '70%' }}>
                            <Text
                              as="p"
                              size="sm"
                              fontFamily={'Mulish'}
                              style={{ fontSize: '14px' }}
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
                              {formatDateToLong(travellers?.dateOfBirth)}
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
  );
};
export default PaymentSuccessPage;
