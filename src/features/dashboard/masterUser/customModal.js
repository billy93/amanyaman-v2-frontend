import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {Box,Input,useDisclosure,Button,Modal,ModalOverlay,ModalBody,ModalFooter,ModalContent, ModalHeader,ModalCloseButton } from '@chakra-ui/react'
import { MdLogin, MdFilterList, MdWarning } from 'react-icons/md'
import { useGetTemplateFileQuery, useUploadFileMutation,useGetUserQuery } from './userApiSlice'
import { setRefetch,refetchdata,setUploadFile, uploadFiles,setUploadMessage,uploadFilesMessage,setListUser } from './masterUserSlice'
import DownloadBtn from './download'
import UseCustomToast from '../../../components/UseCustomToast'

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

const CustomModal = ({ showModalButtonText, modalHeader, modalBody }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
     const { showErrorToast, showSuccessToast } = UseCustomToast();
    const dispatch= useDispatch()
    const filecsv = useSelector(uploadFiles)
    const isRefetch = useSelector(refetchdata)
    const [download,setDowload] = React.useState(false)
    const [toastId, setToastId] = React.useState(null);
    const [page,setPage] = React.useState(0)
    const [filesUpload,setFilesUpload] = React.useState(null)
    const uploadFilesMessages = useSelector(uploadFilesMessage)
    const [trigger,settrigger] = React.useState(false)
    const [uploadFile, { isLoading: loading, isSuccess: success,isError:errorUpload }] = useUploadFileMutation({
        skip:true
      })
    const {
        data : {response:listUserAccount, totalCount} = {},
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetUserQuery({ page, size: 10 },{refetchOnMountOrArgChange:true})
  const prev = usePrevious(isSuccess)
  const prevData = usePrevious(listUserAccount)
  
    const handleDownload = (e) => {
        e.preventDefault()
    }
 const handleFileChange = (e) => {
    if (e.target.files) {
      console.log('filess', e.target.files[0])
      setFilesUpload(e.target.files[0])
      // dispatch(setUploadFile({csvfile:e.target.files[0]}))
    }
 };

  const handleImport = async (e) => {
  e.preventDefault();
    try {
      const response = await uploadFile(filesUpload).unwrap();
      console.log('response', response);
    } catch (err) {
      console.log('err')
    }
};
 
  React.useEffect(() => {
    if (success) {
       dispatch(setRefetch(true))
    }
    
  }, [success, dispatch])
  const prevSuccess = usePrevious(success)
  const prevErr = usePrevious(isError)
  
  React.useEffect(() => {
    let timeoutId;

    if (success) {
      // Clear any existing timeout
      clearTimeout(timeoutId);

      // Set a new timeout to delay showing the toast
      timeoutId = setTimeout(() => {
        const newToastId = showSuccessToast('Upload File successfully!', 'successuploaduser');
        setToastId(newToastId);
        onClose();
        setToastId(null);
        setFilesUpload(null)
      }, 500); // Adjust the delay time as needed

      // Cleanup function to clear the timeout if component unmounts or success state changes
      return () => {
        clearTimeout(timeoutId);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);
  // console.log('filesUpload', filesUpload)
  React.useEffect(() => {
    let timeoutId;

    if (errorUpload) {
      // Clear any existing timeout
      clearTimeout(timeoutId);

      // Set a new timeout to delay showing the toast
      timeoutId = setTimeout(() => {
        const newToastId = showErrorToast('Upload File fail!', 'failuploaduser');
        setToastId(newToastId);
        onClose();
        setToastId(null);
        setFilesUpload(null)
      }, 500); // Adjust the delay time as needed

      // Cleanup function to clear the timeout if component unmounts or success state changes
      return () => {
        clearTimeout(timeoutId);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorUpload]);
  
  
  return (
    <>
      <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20" onClick={onOpen}>
        {showModalButtonText }
    </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>{modalHeader}</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p="1em">
                <Input type="file" onChange={handleFileChange}/>
            </Box>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            {/* <Button variant="ghost" mr={3} onClick={() => refetch()}>
              refetch
            </Button> */}
            <DownloadBtn />
            <Button onClick={handleImport} isLoading={loading} isDisabled={filesUpload ===null ? true : false}>
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default CustomModal