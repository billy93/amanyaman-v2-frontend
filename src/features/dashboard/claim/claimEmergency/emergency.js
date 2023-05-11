import { useGetUsersQuery } from "../claimApiSlice"
import { NavLink } from "react-router-dom";
import Data from '../list.json'
import {
  Box,
  Text,
  Center,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Image,
  Heading,
  Button
} from '@chakra-ui/react'
import {ChevronRightIcon} from '@chakra-ui/icons'
import { useSelector } from "react-redux"
import { selectCurrentUser,selectCurrentTraveller } from "../../../auth/authSlice"
import { MdWarning,MdOutlineDescription } from 'react-icons/md'
import CallCenter from '../../../../img/CallCenter.png'

const ClaimEmergency = () => {
    const user = useSelector(selectCurrentUser)
    const traveller = useSelector(selectCurrentTraveller)
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
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={{base:"4em", md:"4em"}}>
                 <Box borderBottom="1px" borderColor={'#ebebeb'} w="100%">  
                  <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={NavLink} to='/claim/create'>
                                <Text as="b" ml="4" fontSize="sm" color="#065BAA"  _hover={{
                                    borderBottom: "#065BAA",
                                    border:"1 px solid"
                                }}>
                                    Create Claim
                                </Text>
                            </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink as={NavLink} to='#' style={{ pointerEvents: 'none'}}>
                            <Text as={'b'} fontSize={'sm'} color="#231F20"
                           >
                              Claim Emergency
                            </Text>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    </Breadcrumb>
                 </Box>
                </Box>
                <Center m="3" display={'flex'} flexDirection={'column'} p="1em">
                <Box mb={'3'} p={'2'} display="flex" justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                        <Image src={CallCenter} alt="call center" objectFit="cover" w={{base:"100%", md:"351px"}} mb="20px"/>
                        <Heading fontSize='sm' as="b" color="#231F20" style={{ fontSize: '36px' }} fontFamily="Mulish" fontWeight={'700'}>
                            {`Hi! `}
                        </Heading>
                        <Heading fontSize='sm' as="b" color="#231F20" style={{ fontSize: '36px' }} fontFamily="Mulish" fontWeight={'700'}>
                            {`How can we help you?`}
                        </Heading>
                        <Text as={'p'} fontSize='sm' color={'black.200'} p={'3'} style={{fontSize:"14px"}} fontFamily="Mulish" >
                          Call AZP at this number and we can help you create your claim faster.
                        </Text>
                        <Button bg="#50B848" h="50px" w={{ base: "100%", md: "250px" }} _hover={{
                            bg:"#50b848cc"
                        }}>
                           <Text as="b" fontSize={'sm'} color={'#231F20'} style={{fontSize:"24px"}}>021 - 4567890</Text>     
                        </Button>
                </Box>
                </Center>
            </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default ClaimEmergency