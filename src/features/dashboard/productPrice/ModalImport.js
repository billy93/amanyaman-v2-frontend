import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {Box,Input,useDisclosure,Button,Modal,ModalOverlay,ModalBody,ModalFooter,ModalContent, ModalHeader,ModalCloseButton } from '@chakra-ui/react'
import { MdLogin, MdFilterList, MdWarning } from 'react-icons/md'
import { useUploadFilePriceMutation } from './productPriceApi'
// import { setUploadFile, uploadFiles } from './masterUserSlice'
// import { setListAgent } from '../features/dashboard/travelAgent/travelAgentSlice'
import UseCustomToast from '../../../components/UseCustomToast';
import DownloadBtn from './downloadBtn'

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
    const [download,setDowload] = React.useState(false)
    const [page,setPage] = React.useState(0)
    const [filesUpload,setFilesUpload] = React.useState(null)
   const [uploadFilePrice, { isLoading: loading, isSuccess: success }] = useUploadFilePriceMutation({
      skip:true
    })
    // const {
    //     data : {response:listUserAccount, totalCount} = {},
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error,
    //     refetch
    // } = useGetTravelAgentQuery({page,size:10},{refetchOnMountOrArgChange:true})
    
    // const {isLoading,isSuccess,isError} = useGetTemplateFileQuery({
    // skip:true
    // })
    // const prevData = usePrevious(listUserAccount)
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
  
//   const handleImport = async (e) => {
//     e.preventDefault()
//      const formData = new FormData();
//      formData.append('file',filesUpload);
//     //  formData.append('file', new Blob([filesUpload], { type: 'text/csv' }));
//       try {
//           const res = await uploadFilePrice(formData)
//           if (res?.data) {
//               showSuccessToast('Upload file successfully!');
              
//           } else {
//               const errorMessage = `Failed to upload file. Status Code: ${res?.error?.status}`;
//               showErrorToast(errorMessage);
//           }
      
//     } catch (err) {
//       const errorMessage = `Failed to upload file. Status Code: ${err?.error?.status}`;
//               showErrorToast(errorMessage);
//         }
//   }
    
const handleImport = async (e) => {
  e.preventDefault();
  try {
    let response = await uploadFilePrice(filesUpload).unwrap();
    console.log('response', response);

    if (response.ok) {
      showSuccessToast('Upload file successfully!');
    } else {
      const statusCode = response.status;
      const errorMessage = `Failed to upload file. Status Code: ${statusCode}`;
      showErrorToast(errorMessage);
    }
  } catch (err) {
    const statusCode = err.response?.status || 'Unknown';
    const errorMessage = `Failed to upload file. Status Code: ${statusCode}`;
    showErrorToast(errorMessage);
    // settrigger(false);
  }
};

//  React.useEffect(() => {
//     if (success) {
//       refetch({ page, size: 10 })
//       onClose()
//    }
//  }, [success, page])
  
  
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
            <Button onClick={handleImport} isLoading={loading}>
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default CustomModal