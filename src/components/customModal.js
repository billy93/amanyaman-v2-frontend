import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {Box,Input,useDisclosure,Button,Modal,ModalOverlay,ModalBody,ModalFooter,ModalContent, ModalHeader,ModalCloseButton } from '@chakra-ui/react'
import { MdLogin, MdFilterList, MdWarning } from 'react-icons/md'
import { useUploadFileTravelAgentMutation } from '../features/dashboard/travelAgent/travelApiSlice'
// import { setUploadFile, uploadFiles } from './masterUserSlice'

import DownloadBtn from '../features/dashboard/travelAgent/downloadBtn'

const CustomModal = ({ showModalButtonText, modalHeader, modalBody }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch= useDispatch()
    const [download,setDowload] = React.useState(false)
    const [filesUpload,setFilesUpload] = React.useState(null)
  const [uploadFileTravelAgent, { isLoading: loading, isSuccess: success }] = useUploadFileTravelAgentMutation({
      skip:true
    })
    
    // const {isLoading,isSuccess,isError} = useGetTemplateFileQuery({
    // skip:true
    // })
  
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
  
  const handleImport = async (e) => {
    e.preventDefault()
     const formData = new FormData();
     formData.append('file',filesUpload);
    //  formData.append('file', new Blob([filesUpload], { type: 'text/csv' }));
    try {
            const res = await uploadFileTravelAgent(formData)
            console.log('ress', res)
    } catch (err) {
     console.log('err', err)
        }
  }

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