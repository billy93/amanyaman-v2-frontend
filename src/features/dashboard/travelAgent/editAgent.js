/* eslint-disable indent */
import React from 'react';
import { useNavigate, Link as Links, useParams } from 'react-router-dom';
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
  HStack,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  useUpdateAgentMutation,
  useGetCitiesQuery,
  useGetAgentByIdQuery,
} from './travelApiSlice';
import {
  setListAgent,
  listAgent,
  setEditAgent,
  editAgentVal,
  setListCity,
  getlistcity,
} from './travelAgentSlice';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdAdd } from 'react-icons/md';
import { Select } from 'chakra-react-select';
import UseCustomToast from '../../../components/UseCustomToast';
import CustomRadio from '../../../components/customRadio';

const CreateUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const listProducts = useSelector(listAgent);
  const detail = useSelector(editAgentVal);
  const listCity = useSelector(getlistcity);
  const hiddenInputIdtty = React.useRef(null);
  const navigate = useNavigate();
  const [setFields] = React.useState(null);
  const [isChek, setIsChek] = React.useState('allowCreditPayment');
  const { showErrorToast, showSuccessToast } = UseCustomToast();

  React.useEffect(() => {
    if (detail?.allowCreditPayment === false) {
      setIsChek(null);
    } else {
      setIsChek('allowCreditPayment');
    }
  }, [detail?.allowCreditPayment, isChek]);

  const { data: cities } = useGetCitiesQuery(
    { page: 0, size: 999 },
    { refetchOnMountOrArgChange: true }
  );
  const { data: user } = useGetAgentByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [updateAgent] = useUpdateAgentMutation();

  React.useMemo(() => {
    if (cities) {
      let city = cities.map((obj) => ({ ...obj, label: obj.name }));
      dispatch(setListCity(city));
    }
  }, [cities]);

  React.useEffect(() => {
    // const dataUserDetail = users?.filter((user) => user.id === parseInt(id))
    if (user) {
      // const data = [user]
      const datauser = {
        ...user,
        city:
          user !== null
            ? [
                {
                  ...user?.city,
                  label: user?.city?.name,
                  value: user?.city?.name,
                },
              ]
            : null,
      };
      dispatch(setEditAgent(datauser));
      //  dispatch(setDetailAgent(datauser))
    }
  }, [user, dispatch, id]);

  React.useEffect(() => {}, [user]);

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
    const constData = {
      ...detail,
      allowCreditPayment: detail?.allowCreditPayment,
      city: { id: detail?.city[0].id, name: detail?.city[0].name },
    };
    try {
      let data = await updateAgent(constData);
      if (data?.data) {
        showSuccessToast('Agent Edited successfully!');
        dispatch(setListAgent([...listProducts, constData]));
        navigate('/master-data/travel-agent');
        dispatch(setEditAgent(null));
      } else {
        const errorMessage = `Failed to Edit agent. Status Code: ${data?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (err) {
      const errorMessage = `Failed to Edit agent. Status Code: ${err?.error?.status}`;
      showErrorToast(errorMessage);
    }
    setFields(null);
    navigate('/master-data/travel-agent');
  };

  const handleData = (e) => {
    const forms = {
      ...detail,
      [e.target.name]: e.target.value,
    };
    dispatch(setEditAgent(forms));
  };

  function handleSelect(data) {
    console.log('d', data);
    const forms = {
      ...detail,
      city: [
        {
          ...data,
          value: data.id,
        },
      ],
    };
    dispatch(setEditAgent(forms));
  }

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
                  {detail !== null ? 'Edit Agent' : 'Create Agent'}
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
                value={detail !== null ? detail?.travelAgentName : null}
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
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
                  value={detail !== null ? detail?.travelAgentEmail : null}
                  onChange={handleData}
                  h="48px"
                  variant="custom"
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  className="floating-label-global"
                >
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
                  value={detail !== null ? detail?.travelAgentAddress : null}
                  onChange={handleData}
                  h="48px"
                  variant="custom"
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  className="floating-label-global"
                >
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
                  value={detail !== null ? detail?.commission : null}
                  onChange={handleData}
                  h="48px"
                  variant="custom"
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  className="floating-label-global"
                >
                  Commison
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
                  value={detail !== null ? detail?.paymentType : null}
                  onChange={handleData}
                  h="48px"
                  variant="custom"
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  className="floating-label-global"
                >
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
                value={detail !== null ? detail?.travelAgentPhone : null}
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
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
                value={detail !== null ? detail?.custcode : null}
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
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
                value={detail !== null ? detail?.apiPassword : null}
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
                Api password
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
                value={detail !== null ? detail?.custid : null}
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
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
                value={detail !== null ? detail?.cgroup : null}
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
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
                value={detail !== null ? detail?.legalName : null}
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
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
                  detail !== null ? detail?.proformaInvoiceRecipients : null
                }
                onChange={handleData}
                h="48px"
                variant="custom"
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
                Proforma Invoice Recipients{' '}
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto" mt="15px">
            <Stack spacing={4} direction="column">
              {/* <RadioGroup defaultValue={`${detail?.allowCreditPayment}`} onChange={onSelectAllowCredit} >
                <Stack spacing={4} direction='row'>
                  <Radio value={detail?.allowCreditPayment ? 'true' : 'false'}>
                    Allow Credit Payment
                  </Radio>
                </Stack>
              </RadioGroup> */}
              {/* <input type='radio' name="allowCreditPayment" value={detail?.allowCreditPayment ===true ? 'true' : 'false'} checked={detail?.allowCreditPayment ===true ? 'true' : 'false'} onClick={(e) => onSelectAllowCredit(e)}/> */}
              {/* <Radio onChange={onSelectAllowCredit} value={detail?.allowCreditPayment} isChecked={detail?.allowCreditPayment ===1 ? true : false} ><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Allow Credit Payment</Text></Radio> */}
              <HStack>
                <CustomRadio />
              </HStack>
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
                className="floating-label-global"
                isMulti={false}
                name="colors"
                onChange={handleSelect}
                value={detail?.city}
                classNamePrefix="chakra-react-select"
                options={listCity}
                placeholder="Select some colors..."
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
              {/* <Select
                                      isMulti={false}
                                      name="colors"
                                      onChange={handleSelect}
                                      options={listCity}
                                      placeholder="Select some colors..."
                                      closeMenuOnSelect={false}
                                      chakraStyles={{
                                        dropdownIndicator: (provided) => ({
                                          ...provided,
                                          p: 0,
                                          w: "40px"
                                        }),
                                        control: (provided, state) => ({
                                          ...provided,
                                          borderBottomLeftRadius: state.menuIsOpen ? 0 : "md",
                                          borderBottomRightRadius: state.menuIsOpen ? 0 : "md",
                                          transitionDuration: 0
                                        }),
                                        group: (provided) => ({
                                          ...provided,
                                          borderBottomWidth: "1px",
                                          _last: {
                                            borderBottomWidth: 0
                                          }
                                        }),
                                        groupHeading: (provided) => ({
                                          ...provided,
                                          fontSize: th.fontSize,
                                          color: th.color,
                                          fontWeight: th.fontWeight,
                                          px: "0.8rem",
                                          textTransform: "uppercase"
                                        }),
                                        menu: (provided) => ({
                                          ...provided,
                                          my: 0,
                                          borderTopLeftRadius: 0,
                                          borderTopRightRadius: 0,
                                          shadow: `0 0 0 1px ${outlineColor}`,
                                          borderWidth: "1px",
                                          borderColor: outlineColor,
                                          borderBottomRadius: "md",
                                          backgroundColor:"red"
                                        }),
                                        menuList: (provided) => ({
                                          ...provided,
                                          borderTopLeftRadius: 0,
                                          borderTopRightRadius: 0,
                                          borderWidth: 0,
                                          backgroundColor:"red"
                                        })
                                      }} */}

              {/* // /> */}
              {/* <Select
                                    size="lg"
                                    isMulti={false}
                                    variant="outline"
                                    onChange={handleSelect}
                                    value={detail?.city}
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
                className="floating-label-global"
                style={{
                  transform: `${detail?.city}`
                    ? 'translate(-1px, -10px) scale(0.75)'
                    : 'translate(1px, 4px) scale(0.75)',
                  fontSize: '14px',
                  color: `${detail?.city}` ? '#065baa' : '#231F20',
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
              detail?.travelAgentName === '' ||
              detail?.travelAgentEmail === '' ||
              detail?.travelAgentPhone === '' ||
              detail?.custid === '' ||
              detail?.proformaInvoiceRecipients === '' ||
              detail?.apiPassword === '' ||
              detail?.commission === '' ||
              detail?.legalName === '' ||
              detail?.paymentType === '' ||
              detail?.custcode === '' ||
              detail?.city === '' ||
              detail?.allowCreditPayment === 'false' ||
              detail?.cgroup === ''
                ? true
                : false
            }
            variant={'ClaimBtn'}
            style={{ textTransform: 'uppercase', fontSize: '14px' }}
            fontFamily="arial"
            fontWeight={'700'}
            onClick={handleNext}
          >
            Edit
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
export default CreateUser;
