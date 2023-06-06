import React from "react";
import { useGetUserQuery,useDeleteUserMutation } from "./userApiSlice"
import { NavLink, useParams, Link, Navigate, useNavigate } from "react-router-dom";
import {listPolicy} from '../policy/policySlice'
import Data from './list.json'
import Table from "react-table";
import { useTable, usePagination } from "react-table";
import styled from "styled-components";
import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  Divider,
  useToast,
  IconButton
} from '@chakra-ui/react'
import PulseLoader from 'react-spinners/PulseLoader'
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
import {listUsers,listDetailUsers,setDetailUser,formUser,setFormUser} from './masterUserSlice'
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {BsFillPencilFill} from 'react-icons/bs'
import {CiTrash} from 'react-icons/ci'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi'
import { setListUser } from "./masterUserSlice";
import DeleteBtn from './deleteUser'
const Styles = styled.div`
  padding: 1rem;

  table {
    width:100%;
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
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  )
    
  return (
      <>
    <Box mb="1em" display="flex" alignItems="center" gap="10px">
    </Box>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <Box display="flex" justifyContent={'flex-end'} alignItems={'center'} mt="1em">
        <Box>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage} bg="white" border={'none'} _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius:"5px"
        }}>
            <BiSkipPreviousCircle size="25px" color="black" />
            <Text as="p" fontFamily={'Mulish'} style={{fontSize:"12px"}} color="#231F20" pl="5px">Prev</Text>
        </Button>{' | '}
          <Button
            _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius:"5px"
        }}
            onClick={() => nextPage()} disabled={!canNextPage} bg="white" border={'none'}>
            <BiSkipNextCircle size="25px" color="black" />
            <Text fontFamily={'Mulish'} style={{fontSize:"12px"}} color="#231F20" pl="5px">
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
}

const DetailMasterUser = () => {
    // const currentstep = useSelector()
    const dispatch = useDispatch()
    const detailUser = useSelector(listUsers)
    const detail = useSelector(listDetailUsers)
    const policyList = useSelector(listPolicy)
    const {id} = useParams()
    const [isMobile] = useMediaQuery("(max-width: 768px)")
    const [onDelete,setOnDelete] = React.useState(false)
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserQuery({count:5}, { refetchOnMountOrArgChange: true })
  const [deleteUser, { isLoading: onLoading, isSuccess: onSuccess, isError: onError }] = useDeleteUserMutation()
  const data = React.useMemo(() => policyList?.listPolicy);
  const toast = useToast()
  const navigate = useNavigate()
  const Prev = usePrevious(users)
  React.useMemo(() => {
      const dataUserDetail = users?.filter((user) => user.id === parseInt(id))
    if (dataUserDetail) {
        dispatch(setDetailUser([...dataUserDetail]))
      }
  }, users, dispatch, id)
 
  const handleEditUser = (e) => {
    e.preventDefault()
    const datas = {
          id:detail !==null ? detail[0].id : null,
          login:detail !==null ? detail[0].login : null,
          firstName:detail !==null ? detail[0].firstName : null,
          lastName:detail !==null ? detail[0].lastName : null,
          email:detail !==null ? detail[0].email : null,
          authorities:[`${detail !==null ? detail[0].authorities[0] : ''}`]
        }
    dispatch(setFormUser(datas))
    navigate(`/master-data/edit-user/${id}`)
}
const columns = React.useMemo(
    () => [
      {
        Header: "Policy Number",
        accessor: "policyNumber",
        Cell: ({ row }) => (
       
          <Link
            color="#065BAA"
            style={{textDecoration:"underline"}}
            to={`/policies/policy-detail/${row.original.policyNumber}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.policyNumber}
          </Link>
       
    ),
      },
      {
        Header: "Status",
        accessor: "status"
      },
      {
        Header: "Product",
        accessor: "product"
      },
      {
        Header: "Purchase Date",
        accessor: "purchaseDate"
      }
    ],
    []
  );
    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                       <PulseLoader color={"#065BAA"} />
                   </Center>;
    } else if (Data) {
        content = (
            <Box pl="2em" pr="2em">
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={{base:"4em", md:"4em"}}>
                 <Box display="flex" justifyContent={'space-between'} w="100%" borderBottom="1px" borderColor={'#ebebeb'}> 
                  <Box w="100%" pt="15px">  
                    <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                      <BreadcrumbItem isCurrentPage>
                              <BreadcrumbLink as={NavLink} to='/master-data/master-user'>
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
                                {'Mr.'}{detail !==null ? detail[0].firstName : null } {detail !==null ? detail && detail[0].lastName : null}
                              </Text>
                          </BreadcrumbLink>
                      </BreadcrumbItem>
                      </Breadcrumb>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} gap="5px">
                  <IconButton _hover={{color:"white"}} icon={ <BsFillPencilFill color="#065BAA" size={'16px'}/>} bg="white" border="1px solid #ebebeb" onClick={handleEditUser}/>
                  {/* <IconButton _hover={{color:"white"}} icon={ <CiTrash color="#065BAA" size={'16px'}/>} bg="white" border="1px solid #ebebeb" onClick={handleDeletUser}/> */}
                  <DeleteBtn
                  showModalButtonText="Delete"
                  modalHeader="Delete user"
                  modalBody="Confirm delete user ?"
                  />
                  </Box>
                 </Box>
                </Box>
                <Box display={'flex'}>
                    <Box p="3" display={'flex'} flexDirection={'column'}>
                        <Box bg="#ebebeb" w={{base:"100%", md:"386px"}} p={{base:"5px", md:"1em"}}>
                            <Heading as="h4" variant={'primary'} fontFamily={'Mulish'} style={{fontSize:"18px"}} color={'#231F20'}>{detail !== null ? detail[0].firstName : null} {detail !==null ? detail[0].lastName : null}</Heading>
                        </Box>
                        <Box bg="white" w={{base:"100%", md:"386px"}} p={{base:"5px", md:"1em"}}>
                            <Box pb="10px" borderBottom={'1px solid #ebebeb'} display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Fullname'}</Text>
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{ detail !==null ?  detail[0].firstName : null } {detail !==null ? detail[0].lastName : null}</Text>
                            </Box>
                            <Box pb="10px" pt="10px" borderBottom={'1px solid #ebebeb'} display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Email Address'}</Text>
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{detail !==null ? detail[0].email : null}</Text>
                            </Box>
                            <Box pt="10px" pb="10px" borderBottom={'1px solid #ebebeb'} display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Role'}</Text>
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{detail !==null ? detail && detail[0]?.authorities[0] : null}</Text>
                            </Box>
                            <Box pb="10px" pt="10px" borderBottom={'1px solid #ebebeb'} display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Area'}</Text>
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Jakarta'}</Text>
                            </Box>
                        </Box>
                    </Box>
                    <Box w="100%">
                            <Box bg="white" mt="18px" p="14px" border="1px solid #ebebeb">
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}}>Police Created</Text>
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
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default DetailMasterUser