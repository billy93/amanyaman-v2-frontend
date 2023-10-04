/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Button,
  FormControl,
  Input,
  FormLabel,
  Select,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  useCreateUserMutation,
  useGetRoleQuery,
} from '../masterUser/userApiSlice';
import {
  setListUser,
  listUsers,
  listRoleUsers,
  setRoleUser,
  formUser,
  setFormUser,
} from '../masterUser//masterUserSlice';
import { ChevronRightIcon } from '@chakra-ui/icons';
// import { MdAdd } from 'react-icons/md';
import { useGetTravelAgentQuery } from '../travelAgent/travelApiSlice';
// import  OnQueryError  from '../../../components/UseCustomToast'
import UseCustomToast from '../../../components/UseCustomToast';
// import { ChevronRightIcon } from '@chakra-ui/icons';

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

const CreateUser = () => {
  const dispatch = useDispatch();
  const listProducts = useSelector(listUsers);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const listRoles = useSelector(listRoleUsers);
  const formuser = useSelector(formUser);
  const [currency] = React.useState([
    {
      id: 1,
      currencyCode: 'USD',
    },
    {
      id: 2,
      currencyCode: 'EUR',
    },
  ]);
  const [fields, setFields] = React.useState({
    name: '',
    desc: '',
  });
  //   const hiddenInputIdtty = React.useRef(null);
  const navigate = useNavigate();
  const [trigger] = React.useState(false);
  const { data: rolesData } = useGetRoleQuery();
  const prevListRoles = usePrevious(rolesData);
  // const [isValid,setIsvalid] = React.useState(true);
  const [filterby] = React.useState({
    travelAgentName: '',
    custCode: '',
  });
  const { data: { response: listAgent } = {} } = useGetTravelAgentQuery({
    page: 0,
    size: 999,
    ...filterby,
  });

  const [createUser] = useCreateUserMutation({
    skip: trigger === false,
  });

  const handleNext = async (e) => {
    e.preventDefault();
    const datas = {
      login: formuser?.login,
      firstName: formuser?.firstName,
      lastName: formuser?.lastName,
      email: formuser?.email,
      authorities: [`${formuser?.authorities}`],
      travelAgent: {
        id: formUser?.travelAgent,
      },
    };

    try {
      let resp = await createUser(datas);
      // console.log('ress', resp)
      if (resp?.data) {
        showSuccessToast('User created successfully!');
        dispatch(setListUser([...listProducts, datas]));
        navigate('/master-data/master-user');
      } else {
        // const statusCode = error?.response?.status || 'Unknown';
        const errorMessage = `Failed to create user. Status Code: ${resp?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (error) {
      const statusCode = error?.response?.status || 'Unknown';
      const errorMessage = `Failed to create user. Status Code: ${statusCode}`;
      showErrorToast(errorMessage);
    }
    // navigate('/master-data/master-user')
  };

  const handleData = (e) => {
    const forms = {
      ...fields,
      [e.target.name]: e.target.value,
    };
    // dispatch(setFormUser(forms));
    setFields(forms);
  };

  React.useEffect(() => {
    if (JSON.stringify(prevListRoles) !== JSON.stringify(rolesData)) {
      dispatch(setRoleUser(rolesData));
    }
  }, [rolesData, prevListRoles, dispatch]);

  console.log('test', fields);
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
              <BreadcrumbLink as={NavLink} to="/master-data/plan-types">
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
                  Plan Type
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
                  {'Edit Plan Type'}
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
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="name"
                value={fields?.name}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Name
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
                name="postCode"
                value={fields?.desc}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel fontSize="12" pt="1.5">
                Number
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
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
          mt="1em"
        >
          <Button
            isDisabled={
              formuser?.authorities.length === 0 ||
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
