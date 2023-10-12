import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  useGetRoleQuery,
  useUpdateUserMutation,
  useGetUsersByIdQuery,
} from './userApiSlice';
import {
  setDropDownList,
  dropdownlist,
} from '../../dashboard/travelAgent/travelAgentSlice';
import {
  setListUser,
  listUsers,
  listRoleUsers,
  setRoleUser,
  formUser,
  setFormUser,
} from './masterUserSlice';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdAdd } from 'react-icons/md';
import { useGetTravelAgentQuery } from '../travelAgent/travelApiSlice';
import { Select } from 'chakra-react-select';
import UseCustomToast from '../../../components/UseCustomToast';

const CreateUser = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const listProducts = useSelector(listUsers);
  const listRoles = useSelector(listRoleUsers);
  const formuser = useSelector(formUser);
  const dropdowntravelagents = useSelector(dropdownlist);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const [filterby] = React.useState({
    travelAgentName: '',
    custCode: '',
  });
  const hiddenInputIdtty = React.useRef(null);
  const navigate = useNavigate();
  const { data: rolesData } = useGetRoleQuery();

  const { data: { response: listAgent } = {} } = useGetTravelAgentQuery(
    { page: 0, size: 999, ...filterby },
    { refetchOnMountOrArgChange: true }
  );
  const { data: user } = useGetUsersByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  React.useMemo(() => {
    if (listAgent) {
      let list = [
        { label: 'SELECT OPTION', value: '', id: '', name: '' },
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...listAgent?.map((obj, i) => ({
          ...obj,
          travelAgentName: obj.travelAgentName,
          label: obj.travelAgentName,
          name: obj.travelAgentName,
          value: obj.id,
          idx: i,
        })),
      ];
      dispatch(setDropDownList(list));
    }
  }, [listAgent, dispatch]);

  React.useMemo(() => {
    if (rolesData) {
      let city = rolesData?.map((obj, i) => ({
        ...obj,
        label: obj.name,
        value: obj.name,
      }));
      dispatch(setRoleUser(city));
    }
  }, [rolesData, dispatch]);

  React.useEffect(
    () => {
      // const dataUserDetail = users?.filter((user) => user.id === parseInt(id))
      if (user) {
        // const data = [user]
        const datauser = {
          ...user,
          authorities: [
            {
              authorities: user?.authorities[0],
              label: user?.authorities[0],
              value: user?.authorities[0],
            },
          ],
          travelAgent: [
            {
              id: user?.travelAgent?.id,
              travelAgentName: user?.travelAgent?.travelAgentName,
              label: user?.travelAgent?.travelAgentName,
              value: user?.travelAgent?.travelAgentName,
            },
          ],
        };
        dispatch(setFormUser(datauser));
      }
    },
    user,
    dispatch,
    id
  );

  const [updateUser] = useUpdateUserMutation();
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
      id: formuser?.id,
      login: formuser?.login,
      firstName: formuser?.firstName,
      lastName: formuser?.lastName,
      email: formuser?.email,
      authorities: [`${formuser?.authorities[0]?.label}`],
      travelAgent:
        formuser && formuser?.travelAgent[0].id !== ''
          ? { id: formuser && formuser?.travelAgent[0].id }
          : null,
    };

    try {
      let data = await updateUser({ ...datas, id: formuser?.id });
      // console.log('data', data)
      if (data?.data) {
        showSuccessToast('User Edited successfully!');
        dispatch(setListUser([...listProducts, datas]));
        navigate('/master-data/master-user');
      } else {
        // const statusCode = error?.response?.status || 'Unknown';
        const errorMessage = `Failed to Edit user. Status Code: ${data?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (err) {
      const errorMessage = `Failed to Edit user. Status Code: ${err?.error?.status}`;
      showErrorToast(errorMessage);
    }
    navigate('/master-data/master-user');
  };

  const handleData = (e) => {
    const forms = {
      ...formuser,
      [e.target.name]: e.target.value,
    };
    dispatch(setFormUser(forms));
  };

  function handleSelect(data) {
    console.log('datas', data);
    const forms = {
      ...formuser,
      travelAgent: [
        {
          id: data.id,
          label: data.label,
        },
      ],
    };
    dispatch(setFormUser(forms));
  }

  function handleSelectRoles(data) {
    console.log('data', data);
    const forms = {
      ...formuser,
      authorities: [{ ...data }],
    };
    dispatch(setFormUser(forms));
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: formuser?.authorities ? '#e8f0fe' : '#ebebeb', // Conditional background color
      border: '1px solid #000',
      // Add other styles as needed
    }),
  };
  const customStyless = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: formuser?.travelAgent ? '#e8f0fe' : '#ebebeb', // Conditional background color
      border: '1px solid #000',
      // Add other styles as needed
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
                  Users
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
                  Edit User
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
      {/* <Button onClick={handleInvalidateCache}>refresh</Button> */}
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
                {'Edit User'}
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
                  name="firstName"
                  value={formuser?.firstName}
                  onChange={handleData}
                  h="48px"
                  className="global-input"
                  variant={'custom'}
                  background={
                    formuser?.firstName !== '' ? '#e8f0fe' : '#ebebeb'
                  }
                />
                {/* It is important that the Label comes after the Control due to css selectors */}
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  className="floating-label-global"
                >
                  FistName
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
                  name="lastName"
                  value={formuser?.lastName}
                  onChange={handleData}
                  h="48px"
                  variant={'custom'}
                  className="global-input"
                  background={formuser?.lastName !== '' ? '#e8f0fe' : '#ebebeb'}
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
                name="email"
                value={formuser?.email}
                onChange={handleData}
                h="48px"
                variant={'custom'}
                className="gloabl-input"
                background={formuser?.email !== '' ? '#e8f0fe' : '#ebebeb'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                style={{ fontFamily: 'Mulish', fontWeight: 'normal' }}
              >
                Email
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
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
                    onChange={handleSelectRoles}
                    value={formuser?.authorities}
                    classNamePrefix="chakra-react-select"
                    options={listRoles}
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
                        formuser !== null && formuser?.authorities !== ''
                          ? 'translate(0, -10px) scale(0.75)'
                          : 'translate(0, 4px) scale(0.75)',
                      color:
                        formuser !== null && formuser?.authorities === ''
                          ? '#231F20'
                          : '#065baa',
                      fontSize: '12px',
                      fontStyle: 'italic',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Role
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl variant="floating" fontFamily={'Mulish'} mt="14px">
              <Box className="floating-form">
                <Box className="floating-label">
                  <Select
                    defaultValue={null}
                    isMulti={false}
                    name="colors"
                    onChange={handleSelect}
                    value={formuser?.travelAgent}
                    classNamePrefix="chakra-react-select"
                    options={dropdowntravelagents}
                    placeholder=""
                    closeMenuOnSelect={true}
                    styles={customStyless}
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
                        formuser !== null && formuser?.travelAgent !== null
                          ? 'translate(0, -10px) scale(0.75)'
                          : 'translate(0, 4px) scale(0.75)',
                      color:
                        formuser !== null && formuser?.travelAgent === null
                          ? '#231F20'
                          : '#065baa',
                      fontSize: '12px',
                      fontStyle: 'italic',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Travel Agent
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
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
              formuser?.login === '' ||
              formuser?.firstName === '' ||
              formuser?.email === '' ||
              formuser?.lastName === ''
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
