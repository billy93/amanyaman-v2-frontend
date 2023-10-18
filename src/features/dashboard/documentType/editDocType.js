/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { NavLink, Router, useNavigate, useParams } from 'react-router-dom';
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
  useGetAreaByIdQuery,
  useUpdateAreaMutation,
} from '../area/listApiSlice';
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
} from '../masterUser/masterUserSlice';
import {
  useGetDocByIdQuery,
  useUpdateFileDocMutation,
} from './docTypeApiSlice';
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
  const { id } = useParams();
  const { data: areaById, refetch } = useGetDocByIdQuery(id);
  const listProducts = useSelector(listUsers);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const listRoles = useSelector(listRoleUsers);
  const formuser = useSelector(formUser);
  const [files, setFilesUpload] = useState(null);
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
    description: '',
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

  const [updateFileDoc] = useUpdateFileDocMutation({
    skip: trigger === false,
  });

  React.useEffect(() => {
    if (areaById) {
      setFilesUpload(areaById);
    }
  }, [areaById]);
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handleNext = async (e) => {
    e.preventDefault();

    try {
      let resp = await updateFileDoc(files);
      // console.log('ress', resp)
      if (resp?.data) {
        showSuccessToast('Document edited successfully!');
        // dispatch(setListUser([...listProducts, datas]));
        navigate('/master-data/list-document-types');
      } else {
        // const statusCode = error?.response?.status || 'Unknown';
        const errorMessage = `Failed to edit document. Status Code: ${resp?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (error) {
      const statusCode = error?.response?.status || 'Unknown';
      const errorMessage = `Failed to edit document. Status Code: ${statusCode}`;
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

  const handleBack = () => {
    navigate(-1);
  };
  const handleFileChange = (e) => {
    if (e.target.files) {
      console.log('filess', e.target.files[0]);
      setFilesUpload(e.target.files[0]);
      // dispatch(setUploadFile({csvfile:e.target.files[0]}))
    }
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
              <BreadcrumbLink as={NavLink} to="/master-data/areas">
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
                  Area
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
                  {'Document Type'}
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
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                p="1em"
                h="120px"
              >
                <input
                  type="file"
                  id="fileInput"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  // style={{ display: 'none' }}
                />
                <label htmlFor="fileInput" className="custom-file-input">
                  {files ? 'Replace File' : 'Select File'}
                </label>
                {files && (
                  <div>
                    <p>Current file: {files.name}</p>
                  </div>
                )}

                {/* <label htmlFor="fileInput" className="custom-file-input">
                  {files ? files.name : 'Select File'}
                </label> */}
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                className="floating-label-global"
              >
                Upload documentation
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
            variant="ClaimBtn"
            style={{ textTransform: 'uppercase', fontSize: '14px' }}
            fontFamily="arial"
            fontWeight={'700'}
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button
            isDisabled={fields?.files === null ? true : false}
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
