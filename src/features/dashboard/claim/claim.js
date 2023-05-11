import { useGetUsersQuery } from "./claimApiSlice"
import { Link } from "react-router-dom";
import Data from './list.json'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Text,
  Center,
  Button,
  Stack
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import { selectCurrentUser,selectCurrentTraveller } from "../../auth/authSlice"
import { MdWarning,MdOutlineDescription } from 'react-icons/md'


const ClaimList = () => {
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
                <Box pt={ '2'} m={'2.5'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Heading as={'h6'} size={'sm'}>Claim</Heading>
                  <Stack direction='row' spacing={4} m={'2.5'}>
                    {
                    traveller !== undefined && (
                    <Link to="/claim/create/non/step1">
                        <Button leftIcon={<MdOutlineDescription size="17px" />} variant='ClaimBtn' size={'md'} color="white" style={{ fontWeight: 'bold' }}>
                            <Text as="b" color="white" size="sm">
                                Create Claim
                            </Text>
                        </Button>
                    </Link>
                    )
                    
                    }
                </Stack>
                </Box>
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
                                    <Th>Claim Number</Th>
                                    <Th>Traveller</Th>
                                    <Th>Type</Th>
                                    <Th>Claim Type</Th>
                                    <Th >Policy Number</Th>
                                    <Th >Status</Th>
                                    <Th >Policy Start Date</Th>
                                    <Th >Submited Date</Th>
                                    <Th >Last Updated Date</Th>
                             </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                <Tr>
                                    <Td>K-202304A046</Td>
                                    <Td>Mr. ANDI RINALDI ACHYAR</Td>
                                    <Td>REGULAR</Td>
                                    <Td>Perawatan tindak lanjut di indonesia</Td>
                                    <Td>1010152523000017A0TD0</Td>
                                    <Td>draft</Td>
                                    <Td>15-Apr-2023</Td>
                                    <Td>16-Apr-2023</Td>
                                    <Td>25-Apr-2023</Td>
                                </Tr>
                                
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
export default ClaimList