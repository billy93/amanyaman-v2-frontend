/* eslint-disable no-unused-vars */
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
  Select,
  Breadcrumb,
  BreadcrumbItem,
  IconButton,
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
import {
  useGetBandTypesByIdQuery,
  useUpdateBandTypesMutation,
} from './bandTypesApiSlice';
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
  const { id } = useParams();
  const listProducts = useSelector(listUsers);
  const { data: bandTypeById, refetch } = useGetBandTypesByIdQuery(id);
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
    start: 1,
    end: 2,
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

  const [updateBandTypes, { isLoading }] = useUpdateBandTypesMutation({
    skip: trigger === false,
  });

  React.useEffect(() => {
    if (bandTypeById) {
      setFields({
        ...bandTypeById,
      });
    }
  }, [bandTypeById]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handleNext = async (e) => {
    e.preventDefault();

    try {
      let resp = await updateBandTypes(fields);
      // console.log('ress', resp)
      if (resp?.data) {
        showSuccessToast('Band types edit successfully!');
        // dispatch(setListUser([...listProducts, datas]));
        refetch();
        navigate('/master-data/band-types');
      } else {
        // const statusCode = error?.response?.status || 'Unknown';
        const errorMessage = `Failed to edit band types. Status Code: ${resp?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (error) {
      const statusCode = error?.response?.status || 'Unknown';
      const errorMessage = `Failed to edit bandy type. Status Code: ${statusCode}`;
      showErrorToast(errorMessage);
    }
    // navigate('/master-data/master-user')
  };

  const handleData = (e) => {
    let newValue = e.target.value;

    // console.log('dsss', newValue);
    if ((newValue.length === 1 && newValue === '0') || newValue[0] === '0') {
      newValue = '';
    }

    // Additional validation, for example, to ensure it's a valid number
    if (!isNaN(newValue)) {
      setFields({
        ...fields,
        [e.target.name]: parseInt(newValue),
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
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
              <BreadcrumbLink as={NavLink} to="/master-data/band-types">
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
                  Band Type
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
                  {'Edit Band Type'}
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
                type="number"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="start"
                value={fields?.start}
                onChange={handleData}
                h="48px"
                variant={'custom'}
                style={{
                  backgroundColor: fields?.start !== '' ? '#e8f0fe' : '',
                }}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
                Start
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
                type="number"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="end"
                value={fields?.end}
                onChange={handleData}
                h="48px"
                variant={'custom'}
                style={{
                  backgroundColor: fields?.end !== '' ? '#e8f0fe' : '',
                }}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
                End
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
            <Box>
              {fields?.start >= fields?.end && (
                <Text
                  as="p"
                  fontSize={'12px'}
                  color={'red'}
                  fontFamily={'Mulish'}
                  fontStyle={'italic'}
                  p={'3px 1px'}
                >
                  Please fill end bigger than start
                </Text>
              )}
            </Box>
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
            variant="ClaimBtn"
            style={{ textTransform: 'uppercase', fontSize: '14px' }}
            fontFamily="arial"
            fontWeight={'700'}
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button
            isDisabled={
              fields?.start === 0 ||
              fields?.end === 0 ||
              isNaN(fields?.start) ||
              isNaN(fields?.end) ||
              fields?.start >= fields?.end ||
              isLoading
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
