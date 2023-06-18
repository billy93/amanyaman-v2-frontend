/* eslint-disable no-unused-vars */
import React from 'react';
import { useGetUsersQuery } from './reportingApiSlice';
import Data from './list.json';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Stack,
  Button,
  Text,
  Center,
} from '@chakra-ui/react';
import { MdLogin } from 'react-icons/md';
const FeedsList = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <Text as={'p'} size="xs">
          Loading...
        </Text>
      </Center>
    );
  } else if (Data) {
    content = (
      <Box pl="4" pr="4" mt="5em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading as={'h6'} size={'sm'}>
            Reporting CC-R1
          </Heading>
          <Stack direction="row" spacing={4} m={'2.5'}>
            <Button
              leftIcon={<MdLogin />}
              colorScheme="teal"
              variant="outline"
              size={'sm'}
            >
              Export All
            </Button>
          </Stack>
        </Box>
        <Box
          mb={'3'}
          bg={'#0a61b80a'}
          border={'1px'}
          borderColor={'#0a61b8'}
          width={'300px'}
          height={'100px'}
          p={'2'}
          display="flex"
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Text as={'p'} fontSize="xs" color={'black.200'} p={'3'}>
            Monthly Contact Center Claim Performance Analysis
          </Text>
        </Box>
        <Box bg="white" overflow={'scroll'} p="3">
          <TableContainer>
            <Table variant="striped" overflow={'scroll'} size="sm">
              {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Jan</Th>
                  <Th>Feb</Th>
                  <Th>Mar</Th>
                  <Th>Apr</Th>
                  <Th>May</Th>
                  <Th>Jun</Th>
                  <Th>Jul</Th>
                  <Th>Agt</Th>
                  <Th>Sept</Th>
                  <Th>Okt</Th>
                  <Th>Nov</Th>
                  <Th>Des</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Claim Proposed</Td>
                  <Td>121</Td>
                  <Td>8</Td>
                  <Td>4</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                </Tr>
                <Tr>
                  <Td>Claim Accepted</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                </Tr>
                <Tr>
                  <Td>Claim Rejected</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                </Tr>
                <Tr>
                  <Td>Claim On Progress</Td>
                  <Td>121</Td>
                  <Td>8</Td>
                  <Td>4</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                  <Td>0</Td>
                </Tr>
                <Tr>
                  <Td>Claim Finish Percentag</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                </Tr>
                <Tr>
                  <Td>Average Finishing Duration</Td>
                  <Td>15.41</Td>
                  <Td>5.4</Td>
                  <Td>6.4</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                  <Td>0.00</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          {/* <Link to="/welcome">Back to Welcome</Link> */}
        </Box>
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default FeedsList;
