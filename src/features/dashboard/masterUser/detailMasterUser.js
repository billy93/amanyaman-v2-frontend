import { useGetUsersQuery } from "./policyApiSlice"
import { NavLink, useParams } from "react-router-dom";
import Data from './list.json'
import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  Divider
} from '@chakra-ui/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useMediaQuery } from "@chakra-ui/media-query";
import 'react-calendar/dist/Calendar.css';
import {listUsers} from './masterUserSlice'

const DetailMasterUser = () => {
    // const currentstep = useSelector()
    const detailUser = useSelector(listUsers)
    const {id} = useParams()
    const [isMobile] = useMediaQuery("(max-width: 768px)")
    const dataUserDetail = detailUser.filter((user) => user.id === id)
    console.log('dataUserDetail', dataUserDetail)
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
            <Box>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={{base:"4em", md:"4em"}}>
                 <Box borderBottom="1px" borderColor={'#ebebeb'} w="100%" pt="15px">  
                  <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={NavLink} to='/claim/create'>
                                <Text as="b" ml="4" fontSize="sm" color="#065BAA"  _hover={{
                                    borderBottom: "#065BAA",
                                    border:"1 px solid"
                                }}>
                                    User 
                                </Text>
                            </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink as={NavLink} to='#' style={{ pointerEvents: 'none'}}>
                            <Text as={'b'} fontSize={'sm'} color="#231F20"
                           >
                              {'Mr.'}{dataUserDetail[0].fullname}
                            </Text>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    </Breadcrumb>
                 </Box>
                </Box>
                <Box p="3" display={'flex'} flexDirection={isMobile ? 'column' : 'row'}>
                    <Box bg="pink" w={{base:"100%", md:"386px"}}>
                        <Text>test</Text>
                    </Box>
                </Box>
            </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default DetailMasterUser