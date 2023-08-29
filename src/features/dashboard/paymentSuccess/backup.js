/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
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
  Box,
  Button,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl';
import {
  useGetCheckPaymentQuery,
  useGetBookingsQuotationQuery,
} from '../../dashboard/quota-search/policyApiSlice';
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
  const { id } = useParams();
  const [isActive] = useState(false);
  const { data: checkstatus, refetch, isSuccess } = useGetCheckPaymentQuery(id);
  const { data: quotation } = useGetBookingsQuotationQuery(id);
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

  React.useEffect(() => {
    if (id) {
      refetch(id);
    }
  }, [id]);
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
          <Text>Policy Successfully Created!</Text>
          <Text>
            The policy has been successfully issued. Check your detail below
          </Text>
          <Button variant={'outline'}>Email Booking Details</Button>
          <Text>Go to Policy Directory</Text>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box w={{ base: '100%', md: '30%' }}>
          <Box
            display={'flex'}
            flexDirection={'column'}
            border={'1px solid #ebebeb'}
            mt="10px"
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
                {'TRANSACTIONID:123444'}
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
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    color="#065BAA"
                    style={{ fontSize: '12px' }}
                  >
                    {'Single Trip'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    color="#065BAA"
                    style={{ fontSize: '12px' }}
                  >
                    {'Singapore'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    color="#065BAA"
                    style={{ fontSize: '12px' }}
                  >
                    {'01 oct 2023 - 07 oct 2023'}
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
                      {'Asia 50 Individual'}
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
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    color="#065BAA"
                    style={{ fontSize: '12px' }}
                  >
                    {'1'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'Success'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'AMYSCUE33DDJDD'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'CREDIT LIMIT'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'IDR 170000'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'x1'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'IDR 0'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'ABABIL'}
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
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '12px' }}
                    >
                      {'21 agustus 2023'}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box w={{ base: '100%', md: '70%' }} m="1em">
          <Box w="100%">
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
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
                  {'-'}
                </Text>
              </Box>
            </Box>
            <Box></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default PaymentSuccessPage;
