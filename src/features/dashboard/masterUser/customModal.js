import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {Box,Input,useDisclosure,Button,Modal,ModalOverlay,ModalBody,ModalFooter,ModalContent, ModalHeader,ModalCloseButton } from '@chakra-ui/react'
import { MdLogin, MdFilterList, MdWarning } from 'react-icons/md'
import { useGetTemplateFileQuery, useUploadFileMutation,useGetUserQuery } from './userApiSlice'
import { setUploadFile, uploadFiles,setUploadMessage,uploadFilesMessage,setListUser } from './masterUserSlice'
import DownloadBtn from './download'

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
    const filecsv = useSelector(uploadFiles)
    const [download,setDowload] = React.useState(false)
    const [page,setPage] = React.useState(0)
    const [filesUpload,setFilesUpload] = React.useState(null)
    const uploadFilesMessages = useSelector(uploadFilesMessage)
    const [trigger,settrigger] = React.useState(false)
    const [uploadFile, { isLoading: loading, isSuccess: success }] = useUploadFileMutation({
        skip:true
      })
    const {
        data: listUserAccount,
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
    e.preventDefault()
    try {
      await uploadFile(filesUpload).unwrap()
    } catch (err) {
      console.log('err', err)
      settrigger(false)
        }
  }
  
  React.useEffect(() => {
    if (success) {
      refetch({ page, size: 10 })
      onClose()
   }
  }, [success,page])
  
  React.useEffect(() => {
    if (listUserAccount !== null && JSON.stringify(prevData) !== JSON.stringify(listUserAccount)) {
       dispatch(setListUser([...listUserAccount]))
    }
    //  dispatch(setListUser([...listUserAccount]))
  }, [listUserAccount, prevData,dispatch])

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