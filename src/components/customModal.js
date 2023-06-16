import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {Box,Input,useDisclosure,Button,Modal,ModalOverlay,ModalBody,ModalFooter,ModalContent, ModalHeader,ModalCloseButton } from '@chakra-ui/react'
import { MdLogin } from 'react-icons/md'
import { useUploadFileTravelAgentMutation,useGetTravelAgentQuery } from '../features/dashboard/travelAgent/travelApiSlice'
import { isRefetch,setRefetch } from '../features/dashboard/travelAgent/travelAgentSlice'
import UseCustomToast from './UseCustomToast'
import DownloadBtn from '../features/dashboard/travelAgent/downloadBtn'

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
    const dispatch= useDispatch()
    const isrefetch = useSelector(isRefetch)
    const { showErrorToast, showSuccessToast } = UseCustomToast();
    const [download,setDowload] = React.useState(false)
    const [page,setPage] = React.useState(0)
    const [toastId, setToastId] = React.useState(null);
    const [filesUpload,setFilesUpload] = React.useState(null)
  const [uploadFileTravelAgent, { isLoading: loading, isSuccess: success, isError:errorUpload }] = useUploadFileTravelAgentMutation({
      skip:true
    })
    const {
        data : {response:listUserAccount, totalCount} = {},
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetTravelAgentQuery({page,size:10},{refetchOnMountOrArgChange:true})
    
    // const {isLoading,isSuccess,isError} = useGetTemplateFileQuery({
    // skip:true
    // })
    const prevData = usePrevious(listUserAccount)
    const handleDownload = (e) => {
        e.preventDefault()
        setDowload(true)
    }
  
 const handleFileChange = (e) => {
    if (e.target.files) {
      console.log('filess', e.target.files[0])
      setFilesUpload(e.target.files[0])
      // dispatch(setUploadFile({csvfile:e.target.files[0]}))
    }
 };
  
  
  React.useEffect(() => {
    if (success) {
       dispatch(setRefetch(true))
    }
    
  }, [success, dispatch])

  const handleImport = async (e) => {
  e.preventDefault();
  try {
    let response = await uploadFileTravelAgent(filesUpload).unwrap();
    console.log('response', response);
  } catch (err) {
    
  }
};
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
            <DownloadBtn/>
            <Button onClick={handleImport} isLoading={loading} isDisabled={filesUpload ===null ? true :false}>
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default CustomModal