import React, { useState } from 'react';
import { useGetUsersQuery } from "./policyApiSlice"
import { Link } from "react-router-dom";
import Data from './list.json'
import {
 LinkBox,
 Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalFooter,
ModalBody,
ModalCloseButton,
Link as Links,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  LinkOverlay,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Stack,
  Text,
  Center,
  useDisclosure,
  IconButton
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import {listPolicy,setStatePolicyList,listSelected,setStateSelectedt} from './policySlice'
import {MdLogin,MdFilterList,MdWarning} from 'react-icons/md'
import {AiOutlineClose} from 'react-icons/ai'

const PolicyList = () => {
    const [MasterChecked, setMasterChecked] = useState(false)
    const dispatch = useDispatch()
    const tempList = useSelector(listPolicy);
    const listSelect = useSelector(listSelected);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const onMasterCheck = (e) => {
        // let datas = tempList?.listPolicy.map((obj)=>({...obj,'select':e.target.checked}))
        let datas = tempList?.listPolicy.map((obj) => ({...obj, select:`${e.target.checked}`}))
        let data = {
            MasterChecked: `${e.target.checked}`,
            listPolicy: [...datas],
        }
        dispatch(setStatePolicyList(data))
        dispatch(setStateSelectedt(datas))
    }
    
  const onItemCheck = (e, item) => {
    let d = [...tempList?.listPolicy]
    // let datas = tempList?.listPolicy.map((obj)=>({...obj,'select':e.target.checked}))
    const newstate = d.map(obj => obj.id === item.id ? { ...obj, select: `${e.target.checked}` } : obj)
    const totalItems = tempList?.listPolicy.length;
    const totalCheckedItems = tempList?.listPolicy.filter((e) => e.select);
    // Update State
      let idx = totalCheckedItems + 1
      console.log('tot', totalItems)
      console.log('tot idx', totalCheckedItems[0].select)
      let data = {
            MasterChecked: (totalItems === totalCheckedItems)? "true" : "false",
            listPolicy: [...newstate],
        }
        dispatch(setStatePolicyList(data))
        dispatch(setStateSelectedt(newstate))
  }
 const onOpenModal = () => {
        onOpen()
        getSelectedRows()
 }
const handleOnClick = (e) =>{
    console.log('e', e)
}
const getSelectedRows = () => {
    let data = [...tempList?.listPolicy]
    dispatch(setStateSelectedt(data.filter((item) => item.select ==="true")))
  }
    const clearSelect = () => {
        dispatch(setStateSelectedt([]))
        let datas = tempList?.listPolicy.map((obj) => ({...obj, select:`false`}))
        let data = {
            MasterChecked: `false`,
            listPolicy: [...datas],
        }
        dispatch(setStatePolicyList(data))
}
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                    <Text as={'p'} size="xs">
                        Loading...
                    </Text>
                   </Center>;
    } else if (Data) {
        content = (
            <Box pl="4" pr="4" mt="5em">
                <Modal size="xl" blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="56rem">
                <ModalHeader>
                    <Heading variant="primary" as="div" size="lg" fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'18px'}}>
                        Refund Policies
                    </Heading>
                    <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'14px'}} fontWeight={'normal'}>
                        You’re about to refund 3 policies:
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                   <TableContainer>
                    <Table variant={'simple'}>
                        <Thead>
                        <Tr>
                            <Th>Policy Number</Th>
                                    <Th>Traveller</Th>
                                    <Th isNumeric>Booking ID</Th>
                                    <Th >Product</Th>
                                    <Th >Status</Th>
                                    <Th >Issued By</Th>
                                    <Th >Purchase Date</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                             {
                                    listSelect?.map((item, i) => {
                                        return (
                                            <Tr key={item.id} className={item.select ? "checked" : ""} >
                                                <Td>{item.policyNumber }</Td>
                                                <Td>{ item.traveller}</Td>
                                                <Td>{ item.bookingId}</Td>
                                                <Td>{ item.product}</Td>
                                                <Td>{ item.status}</Td>
                                                <Td>{ item.issuedBy}</Td>
                                                <Td>{ item.purchaseDate}</Td>
                                            </Tr>
                                        )
                                    })
                               }
                        </Tbody>
                         <TableCaption textAlign={'left'} >
                                        <Text as="p" fontSize={'sm'} style={{fontSize:"14px"}} fontFamily={'Mulish'}>
                                         Once refunded, travellers within these policies won’t be able to claim their insurances. Are you sure?
                                        </Text>
                         </TableCaption>
                    </Table>
                    </TableContainer>
                </ModalBody>

                <ModalFooter>
                        <Button onClick={onClose}>Cancel</Button>
                         <Button colorScheme='blue' mr={3} >
                        Refund
                        </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Heading as={'h6'} size={'sm'}>Policies</Heading>
                <Stack direction='row' spacing={4} m={'2.5'}>
                    <Button leftIcon={<MdFilterList />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Apply Filter
                    </Button>
                    <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Export All
                    </Button>
                </Stack>
            </Box>
            {
                    listSelect?.filter((item) => item.select === "true").length > 0 && (
                      <Box mb="1em" gap="1em" display={'flex'} alignItems={'center'}>
                        {/* <Button
                        variant="base"
                        className="btn btn-primary"
                        onClick={clearSelect}
                        >
                                
                        </Button> */}
                            <Text as="p" fontSize={'sm'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                {listSelect?.filter((item) => item.select === "true").length} {'Selected'}
                            </Text>
                            <IconButton bg={'white'} onClick={clearSelect} size="sm" icon={<AiOutlineClose size="16px" color='black'/>} />
                        <Button
                        variant="base"
                        className="btn btn-primary"
                        onClick={onOpenModal}
                        >
                                Refund
                        </Button>
                        </Box>  
                )
            }
            
            <Box mb={'3'} bg={'#ffeccc'} border={'1px'} borderColor={'#ffa000'} width={'300px'} height={'100px'} p={'2'} display="flex" justifyContent={'center'} alignItems={'center'}>
                <Box bg="#FFA00">
                    <MdWarning size={'20px'} color="#FFA000"/>
                </Box>
                <Text as={'p'} fontSize='xs' color={'black.200'} p={'3'}>
                        You can only claim policy of Success policy status with maximum 30 days from the end date and no ongoing/successful refund record
                </Text>
            </Box>
            <Box bg="white" overflow={'scroll'} p="3">
                    <TableContainer>
                       <Table variant="simple" colorScheme="cyan" overflow={'scroll'} size="sm">
                         {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                            <Thead>
                                <Tr>
                                    <Th scope="col">
                                        <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={tempList?.MasterChecked  ==="true" ? "checked" : ""}
                                        id="mastercheck"
                                        onChange={(e) => onMasterCheck(e)}
                                        />
                                    </Th>
                                    <Th>Policy Number</Th>
                                    <Th>Traveller</Th>
                                    <Th isNumeric>Booking ID</Th>
                                    <Th >Product</Th>
                                    <Th >Status</Th>
                                    <Th >Issued By</Th>
                                    <Th >Purchase Date</Th>
                             </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    tempList?.listPolicy.map((item, i) => {
                                        return (
                                            <Tr key={item.id} className={item.select ? "checked" : ""}>
                                                <Td scope="row">
                                                <input
                                                    type="checkbox"
                                                    checked={item.select ==="true" ? "checked" : ""}
                                                    className="form-check-input"
                                                    // id={`${rowcheck{user.id}}`}
                                                    onChange={(e) => onItemCheck(e, item)}
                                                />
                                                </Td>
                                                <Td>{ item.policyNumber}</Td>
                                                <Td>{ item.traveller}</Td>
                                                <Td>{ item.bookingId}</Td>
                                                <Td>{ item.product}</Td>
                                                <Td>{ item.status}</Td>
                                                <Td>{ item.issuedBy}</Td>
                                                <Td>{ item.purchaseDate}</Td>
                                            </Tr>
                                        )
                                    })
                               }
                            </Tbody>
                    </Table>
                    </TableContainer>
                {/* <Link to="/welcome">Back to Welcome</Link> */}
            </Box>
          </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default PolicyList