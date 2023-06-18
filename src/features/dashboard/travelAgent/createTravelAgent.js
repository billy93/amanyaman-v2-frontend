import React from 'react';
import { useNavigate, Link as Links } from 'react-router-dom';
import {
  Box,
  Stack,
  Breadcrumb,
  Text,
  Button,
  FormControl,
  FormLabel,
  BreadcrumbItem,
  BreadcrumbLink,
  Input,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useCreateAgentMutation, useGetCitiesQuery } from './travelApiSlice';
import {
  setListAgent,
  listAgent,
  formAgent,
  setFormAgent,
  listDetailAgent,
  setListCity,
  getlistcity,
} from './travelAgentSlice';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdAdd } from 'react-icons/md';
import { Select } from 'chakra-react-select';
import UseCustomToast from '../../../components/UseCustomToast';
import CustomRadio from '../../../components/customRadioCreate';

const CreateUser = () => {
  const dispatch = useDispatch();
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const listProducts = useSelector(listAgent);
  const detail = useSelector(listDetailAgent);
  const formuser = useSelector(formAgent);
  const listCity = useSelector(getlistcity);
  const hiddenInputIdtty = React.useRef(null);
  const navigate = useNavigate();
  const [trigger] = React.useState(false);
  const { data: cities } = useGetCitiesQuery(
    { page: 0, size: 999 },
    { refetchOnMountOrArgChange: true }
  );
  const [createAgent] = useCreateAgentMutation({
    skip: trigger === false,
  });

  React.useMemo(() => {
    if (cities) {
      let city = cities.map((obj) => ({
        ...obj,
        label: obj.name,
        value: obj.name,
      }));
      dispatch(setListCity([...city]));
    }
  }, [cities]);

  const handleUploadIdentity = (e) => {
    hiddenInputIdtty.current.click();
  };

  const handleidentityCard = (e, i) => {
    e.preventDefault();
    if (e.target.files) {
      //   dispatch(setuploadDoc(data))
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const datas = {
      travelAgentName: formuser?.travelAgentName,
      travelAgentEmail: formuser?.travelAgentEmail,
      travelAgentAddress: formuser?.travelAgentAddress,
      commission: formuser?.commission,
      paymentType: formuser?.paymentType,
      travelAgentPhone: formuser?.travelAgentPhone,
      custcode: formuser?.custcode,
      apiPassword: formuser?.apiPassword,
      custid: formuser?.custid,
      cgroup: formuser?.cgroup,
      legalName: formuser?.legalName,
      proformaInvoiceRecipients: formuser?.proformaInvoiceRecipients,
      allowCreditPayment: formuser?.allowCreditPayment,
      city: {
        ...formuser?.city,
      },
    };

    try {
      let data = await createAgent(datas);
      // console.log('dataa',data)
      if (data?.data) {
        showSuccessToast('Agent Create successfully!');
        dispatch(setListAgent([...listProducts, datas]));
        navigate('/master-data/travel-agent');
      } else {
        // const statusCode = error?.response?.status || 'Unknown';
        const errorMessage = `Failed to Create agent. Status Code: ${data?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (err) {
      const errorMessage = `Failed to Edit agent. Status Code: ${err?.error?.status}`;
      showErrorToast(errorMessage);
    }
    // navigate('/master-data/travel-agent')
  };

  const handleData = (e) => {
    const forms = {
      ...formuser,
      [e.target.name]: e.target.value,
    };
    dispatch(setFormAgent(forms));
  };

  const handleDataSelectc = (data) => {
    const forms = {
      ...formuser,
      city: {
        ...data,
      },
    };
    dispatch(setFormAgent(forms));
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#f2f2f2', // Set the desired background color for the select control
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'blue' : 'white', // Set the background color for selected and non-selected options
      color: state.isSelected ? 'white' : 'black', // Set the text color for selected and non-selected options
    }),
  };

  return (
    <Stack mt={{ base: '1em', md: '5em' }}>
      <Box
        p="12px"
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
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
              <BreadcrumbLink as={Links} to="/master-data/travel-agent">
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
                  Travel Agent
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Links}
                to="#"
                style={{ pointerEvents: 'none' }}
              >
                <Text as={'b'} fontSize={'sm'} color="#231F20">
                  Create Agent
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              fontFamily={'Mulish'}
              id="float-label"
              mt="30px"
            >
              <Box display={'flex'} pt="1em">
                <Box>
                  <Button
                    bg="#ebebeb"
                    borderRadius={'50%'}
                    variant={'base'}
                    w={{ md: '88px' }}
                    h={{ md: '88px' }}
                    onClick={handleUploadIdentity}
                    border={'2px'}
                    borderStyle={'dashed'}
                    borderColor={'#ebebeb'}
                  >
                    <MdAdd size={'1em'} color="#065BAA" />
                  </Button>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  pl="5px"
                  pt="10px"
                >
                  <Text
                    as="b"
                    size="sm"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color="#065BAA"
                  >
                    Choose a file
                  </Text>
                  <Text
                    as="p"
                    size="sm"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    Acceptable formats: jpeg & png only. Max. file size is 500kb
                    and min. size 70kb
                  </Text>
                </Box>
              </Box>
              <Input
                type="file"
                name={'identityCard'}
                onChange={(e) => handleidentityCard(e, 'File Identity')}
                style={{ display: 'none' }}
                ref={hiddenInputIdtty}
              />
              <FormLabel
                fontSize="14"
                pt="1.5"
                style={{
                  transform: 'translate(-12px, -37px) scale(0.75)',
                  color: '#231F20',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
                fontFamily={'Mulish'}
              >
                {detail !== null ? 'Edit Agent' : 'Create Agent'}
              </FormLabel>
              <Text
                as="p"
                fontSize={'sm'}
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
              ></Text>
              {/* <Button onClick={handleUploadClick}>Upload</Button> */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="travelAgentName"
                value={formuser !== null ? formuser.travelAgentName : null}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Travel Agent Name
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box
            display="flex"
            gap="5px"
            m="auto"
            width={{ base: '100%', md: '540px' }}
          >
            <Box width={{ base: '100%', md: '240px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Input
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  name="travelAgentEmail"
                  value={formuser !== null ? formuser?.travelAgentEmail : null}
                  onChange={handleData}
                  h="48px"
                  variant={'custom'}
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel fontSize="12" pt="1.5">
                  Travel Agent Email
                </FormLabel>
                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
            <Box width={{ base: '100%', md: '240px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Input
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  name="travelAgentAddress"
                  value={
                    formuser !== null ? formuser?.travelAgentAddress : null
                  }
                  onChange={handleData}
                  h="48px"
                  variant={'custom'}
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel fontSize="12" pt="1.5">
                  travel Agent Address
                </FormLabel>
                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
          </Box>
          <Box
            display="flex"
            gap="5px"
            m="auto"
            width={{ base: '100%', md: '540px' }}
          >
            <Box width={{ base: '100%', md: '240px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Input
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  name="commission"
                  value={formuser !== null ? formuser?.commission : null}
                  onChange={handleData}
                  h="48px"
                  variant={'custom'}
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel fontSize="12" pt="1.5">
                  Commisson
                </FormLabel>
                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
            <Box width={{ base: '100%', md: '240px' }}>
              <FormControl
                variant="floating"
                id="first-name"
                isRequired
                mt="14px"
              >
                <Input
                  placeholder=" "
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  name="paymentType"
                  value={formuser !== null ? formuser?.paymentType : null}
                  onChange={handleData}
                  h="48px"
                  variant={'custom'}
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel fontSize="12" pt="1.5">
                  Payment type
                </FormLabel>
                {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
              </FormControl>
            </Box>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="travelAgentPhone"
                value={formuser !== null ? formuser?.travelAgentPhone : null}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Travel Agent Phone
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="custcode"
                value={formuser !== null ? formuser?.custcode : null}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Cust Code
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="apiPassword"
                value={formuser !== null ? formuser?.apiPassword : null}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Api Password
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="custid"
                value={formuser !== null ? formuser?.custid : null}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Cust Id
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="cgroup"
                value={formuser !== null ? formuser?.cgroup : null}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                CGroup
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="legalName"
                value={formuser !== null ? formuser?.legalName : null}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Legal Name
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="proformaInvoiceRecipients"
                value={
                  formuser !== null ? formuser?.proformaInvoiceRecipients : null
                }
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Proforma Invoice Recipients{' '}
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto" mt="15px">
            <Stack spacing={4} direction="column">
              <CustomRadio />
            </Stack>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto" mt="1em" mb="1em">
            <FormControl
              variant="floating"
              fontFamily={'Mulish'}
              isRequired
              h="48px"
            >
              <Select
                isMulti={false}
                name="colors"
                onChange={handleDataSelectc}
                value={formuser?.city}
                isSearchable={false}
                classNamePrefix="chakra-react-select"
                options={listCity}
                placeholder="Select some colors..."
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
                      transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                    },
                  }),
                }}
              />
              {/* <Select
                                    size="lg"
                                    isMulti={false}
                                    variant="outline"
                                    onChange={handleDataSelectc}
                                    value={formuser?.city}
                                    isSearchable={false}
                                    styles={{
                                    menuPortal: (provided) => ({ ...provided})
                                    }}
                                    options={listCity}
                                    /> */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                fontFamily={'Mulish'}
                style={{
                  transform: `${formuser?.city}`
                    ? 'translate(-1px, -10px) scale(0.75)'
                    : 'translate(1px, 4px) scale(0.75)',
                  fontSize: '14px',
                  color: `${formuser?.city}` ? '#065baa' : '#231F20',
                }}
              >
                Select City
              </FormLabel>
            </FormControl>
          </Box>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          p="9px"
          borderRadius={'5px'}
          border="1px"
          borderColor={'#ebebeb'}
        >
          <Button
            isDisabled={
              formuser?.travelAgentName === '' ||
              formuser?.commission === '' ||
              formuser?.paymentType === '' ||
              formuser?.legalName === '' ||
              formuser?.travelAgentEmail === '' ||
              formuser?.travelAgentPhone === '' ||
              formuser?.custid === '' ||
              formuser?.proformaInvoiceRecipients === '' ||
              formuser?.custcode === '' ||
              formuser?.city?.id === '' ||
              formuser?.cgroup === ''
                ? true
                : false
            }
            variant={'ClaimBtn'}
            style={{ textTransform: 'uppercase', fontSize: '14px' }}
            fontFamily="arial"
            fontWeight={'700'}
            onClick={handleNext}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
export default CreateUser;
