/* eslint-disable no-unused-vars */
import React from 'react';
import { useGetUsersQuery, useGetPolicyListQuery } from './policyApiSlice';
import { NavLink, Link } from 'react-router-dom';
import { listPolicy } from '../policy/policySlice';
import Data from './list.json';
import { useTable, usePagination } from 'react-table';
import styled from 'styled-components';
import { Box, Heading, Text, Center, Button } from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import 'react-calendar/dist/Calendar.css';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';

const Styles = styled.div`
  padding: 1rem;

  table {
    width: 100%;
    border-spacing: 0;
    border-top: 1px solid #ebebeb;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #ebebeb;
      border-right: 1px solid #ebebeb;

      :last-child {
        border-right: 0;
      }
    }
  }
  .pagination {
    padding: 0.5rem;
  }
`;

// eslint-disable-next-line react/display-name, no-unused-vars
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const Tables = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <>
      <Box mb="1em" display="flex" alignItems="center" gap="10px"></Box>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th key={column.id} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td key={cell.id} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Box
        display="flex"
        justifyContent={'flex-end'}
        alignItems={'center'}
        mt="1em"
      >
        <Box>
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            bg="white"
            border={'none'}
            _hover={{
              bg: '#f0eeee',
              borderRadius: '5px',
              WebkitBorderRadius: '5px',
              MozBorderRadius: '5px',
            }}
          >
            <BiSkipPreviousCircle size="25px" color="black" />
            <Text
              as="p"
              fontFamily={'Mulish'}
              style={{ fontSize: '12px' }}
              color="#231F20"
              pl="5px"
            >
              Prev
            </Text>
          </Button>
          {' | '}
          <Button
            _hover={{
              bg: '#f0eeee',
              borderRadius: '5px',
              WebkitBorderRadius: '5px',
              MozBorderRadius: '5px',
            }}
            onClick={() => nextPage()}
            disabled={!canNextPage}
            bg="white"
            border={'none'}
          >
            <BiSkipNextCircle size="25px" color="black" />
            <Text
              fontFamily={'Mulish'}
              style={{ fontSize: '12px' }}
              color="#231F20"
              pl="5px"
            >
              Next
            </Text>
          </Button>{' '}
        </Box>
        <Box>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </Box>
        {/* <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </Box>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              "selectedFlatRows[].original": selectedFlatRows.map(
                (d) => d.original
              )
            },
            null,
            2
          )}
        </code>
      </pre> */}
    </>
  );
};

const DetailPolcy = () => {
  // const currentstep = useSelector()
  const policyList = useSelector(listPolicy);

  const { data: users, isLoading, isError, error } = useGetPolicyListQuery();
  const data = React.useMemo(() => policyList?.listPolicy);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Policy Number',
        accessor: 'policyNumber',
        Cell: ({ row }) => (
          <Link
            color="#065BAA"
            style={{ textDecoration: 'underline' }}
            to={`/policies/policy-detail/${row.original.policyNumber}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.policyNumber}
          </Link>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Product',
        accessor: 'product',
      },
      {
        Header: 'Purchase Date',
        accessor: 'purchaseDate',
      },
    ],
    []
  );
  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (Data) {
    content = (
      <Box pl="2em" pr="2em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt={{ base: '4em', md: '4em' }}
        >
          <Box borderBottom="1px" borderColor={'#ebebeb'} w="100%" pt="15px">
            <Breadcrumb
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
            >
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink as={NavLink} to="/claim/create">
                  <Text
                    as="b"
                    ml="4"
                    fontSize="sm"
                    color="#065BAA"
                    _hover={{
                      borderBottom: '#065BAA',
                      border: '1 px solid',
                    }}
                  >
                    User
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink
                  as={NavLink}
                  to="#"
                  style={{ pointerEvents: 'none' }}
                >
                  <Text as={'b'} fontSize={'sm'} color="#231F20">
                    {'Mr.'}
                    {'getDetail.fullname'}
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Box>
        <Box display={'flex'}>
          <Box p="3" display={'flex'} flexDirection={'column'}>
            <Box
              bg="#ebebeb"
              w={{ base: '100%', md: '386px' }}
              p={{ base: '5px', md: '1em' }}
            >
              <Heading
                as="h4"
                variant={'primary'}
                fontFamily={'Mulish'}
                style={{ fontSize: '18px' }}
                color={'#231F20'}
              >
                {'dataUserDetail[0].fullname'}
              </Heading>
            </Box>
            <Box
              bg="white"
              w={{ base: '100%', md: '386px' }}
              p={{ base: '5px', md: '1em' }}
            >
              <Box
                pb="10px"
                borderBottom={'1px solid #ebebeb'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                justifyContent={'center'}
              >
                <Text
                  as="b"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'Fullname'}
                </Text>
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'dataUserDetail[0].fullname'}
                </Text>
              </Box>
              <Box
                pb="10px"
                pt="10px"
                borderBottom={'1px solid #ebebeb'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                justifyContent={'center'}
              >
                <Text
                  as="b"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'Email Address'}
                </Text>
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'dataUserDetail[0].email'}
                </Text>
              </Box>
              <Box
                pt="10px"
                pb="10px"
                borderBottom={'1px solid #ebebeb'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                justifyContent={'center'}
              >
                <Text
                  as="b"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'Role'}
                </Text>
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'dataUserDetail && dataUserDetail[0]?.role'}
                </Text>
              </Box>
              <Box
                pb="10px"
                pt="10px"
                borderBottom={'1px solid #ebebeb'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                justifyContent={'center'}
              >
                <Text
                  as="b"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'Area'}
                </Text>
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  {'Jakarta'}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box w="100%">
            <Box bg="white" mt="18px" p="14px" border="1px solid #ebebeb">
              <Text as="p" fontFamily={'Mulish'} style={{ fontSize: '14px' }}>
                Police Created
              </Text>
            </Box>
            <Box bg="white" overflow={'scroll'}>
              <Styles>
                <Tables columns={columns} data={data} />
              </Styles>
              {/* <Link to="/welcome">Back to Welcome</Link> */}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default DetailPolcy;
