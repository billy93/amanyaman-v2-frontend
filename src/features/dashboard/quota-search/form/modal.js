import {Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalFooter,
ModalBody,
ModalCloseButton,
Button,
useDisclosure
} from '@chakra-ui/react'
const  ModalForm = ({onOpen,isOpen,onClose}) => {
//   const { isOpen, onOpen, onClose } = useDisclosure()
console.log('on open', onOpen)
console.log('on isOpen', isOpen)
  return (
    <>
    {
              onOpen && (            
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <p>test</p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        )
    }
    </>
  )
}
export default ModalForm;