import React, { useState } from 'react';
import { useGetUsersQuery } from "./masterProductApiSlice"
import { Link } from "react-router-dom";
import Data from './list.json'
import Table from "react-table";
import {
useToast,
Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalFooter,
ModalBody,
ModalCloseButton,
Input,
InputGroup,
InputLeftElement,
InputRightAddon,
Link as Links,
  Box,
  Table as TableNew,
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
import {setMasterProduct,setListSelectProduct,listProduct,listProductSelection} from './masterProductSlice'
import {MdLogin,MdFilterList,MdWarning} from 'react-icons/md'
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import styled from "styled-components";
import { useTable, useRowSelect } from "react-table";
import { Search2Icon } from "@chakra-ui/icons";

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

    thead {
      th,td{
        margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #ebebeb;
      border-right: 1px solid #ebebeb;
      background-color: #fff;
      color: #231F20;
      padding: 13px 15px;
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      text-align: left;
      white-space: nowrap;
      font-weight: bold;
      min-width: 40px;
      vertical-align: bottom;
      background-clip: padding-box;
      }
    }
    
      
      :last-child {
        border-right: 0;
      },
      tbody{
        td,th{
          max-width: 250px;
          color: #231F20;
          padding: 13px 15px 10px;
          text-align: left;
          white-space: normal;
          vertical-align: top;
          border-bottom: 1px solid #ebebeb;
          background-clip: padding-box;
          height: 35px;
          color:"grey";
        }
      }
    }
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
 const dispatch = useDispatch()
 const listproduct = useSelector(listProduct)
 const selected = useSelector(listProductSelection)
 const prevSelected = usePrevious(selected)
 const { isOpen, onOpen, onClose } = useDisclosure()
 const toast = useToast()
   const onOpenModal = () => {
        onOpen()
        // getSelectedRows()
 }
    const onCloseModal = () => {
        onClose()
        dispatch(setListSelectProduct([]))
        // resetSelectedRows: () => toggleAllRowsSelected(false)
        // getSelectedRows()
    }
     const clearSelect = () => {
     dispatch(setListSelectProduct([]))
     onClose()
     const rowIds = listproduct?.map((item,i) =>i);
     rowIds.forEach(id => toggleRowSelected(id, false));
 }
     const cancelDelete = () => {
     onClose()
 }
    const deletedUser = () => {
    //  dispatch(setMasterUser([]))
     onOpen()
    //  const rowIds = listuser?.map((item,i) =>i);
    //  rowIds.forEach(id => toggleRowSelected(id, false));
 }
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    toggleAllRowsSelected,
    toggleRowSelected,
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div style={{display:"flex", justifyContent:"center", alignItems:'center'}}>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div style={{display:"flex", justifyContent:"center", alignItems:'center'}}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
        ...columns
      ]);
    }
      );
  const prev = usePrevious(selectedRowIds)
  React.useEffect(() => {
      toggleAllRowsSelected();
  }, []);
    
  React.useEffect(() => {
      if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
          getValues(selectedFlatRows)
      }
  }, [prev, selectedRowIds]);
  
  // Render the UI for your table
    const getValues = (data) => {
     let original = data.map((item) => item.original)
     dispatch(setListSelectProduct(original))
    }
    
    const deletedUserUpdate = (e) => {
        e.preventDefault()
        const nextState = listproduct.filter(
        item => !selected.some(({ id }) => item.id === id)
        );
        console.log('nextState',nextState)
        dispatch(setMasterProduct(nextState))
        dispatch(setListSelectProduct([]))
        onClose()
        toast({
                  title: `Deleted Success`,
                  status:"success",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid",
                })
          } 
 console.log('id', listproduct)
  return (
      <>
          <Modal size="xl" blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="56rem">
                <ModalHeader>
                    <Heading variant="primary" as="div" size="lg" fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'18px'}}>
                        Delete Product
                    </Heading>
                    <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'14px'}} fontWeight={'normal'}>
                        You’re about to delete {selected?.length} product:
                    </Text>
                </ModalHeader>
                <ModalCloseButton onClick={clearSelect}/>
                <ModalBody pb={6}>
                   <TableContainer>
                    <TableNew variant={'simple'}>
                        <Thead>
                        <Tr>
                                   <Th>Product Id</Th>
                                    <Th>Product Code</Th>
                                    <Th>Product Detail Code</Th>
                                    <Th >Currency</Th>
                                    <Th >Product Description</Th>
                                    <Th >Personal Accident Cover</Th>
                                    <Th >Medical Cover</Th>
                                    <Th >Travel Cover	</Th>
                                    <Th >Product Type	</Th>
                                    <Th >Travel Duration</Th>
                                    <Th >Additional Week</Th>
                                    <Th >Updated Data</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                             {
                                    selected?.map((item, i) => {
                                        return (
                                            <Tr key={item.id} >
                                                <Td>{item.productId }</Td>
                                                <Td>{ item.productCode}</Td>
                                                <Td>{ item.productDetailCode}</Td>
                                                <Td>{ item.currency}</Td>
                                                <Td>{ item.productDescription}</Td>
                                                <Td>{ item.personalAccidentCover}</Td>
                                                <Td>{ item.medicalCover}</Td>
                                                <Td>{ item.travelCover}</Td>
                                                <Td>{ item.productType}</Td>
                                                <Td>{ item.travelDuration}</Td>
                                                <Td>{ item.additionalWeek}</Td>
                                                <Td>{ item.updatedData}</Td>
                                            </Tr>
                                        )
                                    })
                               }
                        </Tbody>
                         <TableCaption textAlign={'left'} >
                                        <Text as="p" fontSize={'sm'} style={{fontSize:"14px"}} fontFamily={'Mulish'}>
                                         Deleting these products will remove all of it’s information from the database. This cannot be undone.
                                        </Text>
                         </TableCaption>
                    </TableNew>
                    </TableContainer>
                </ModalBody>

                <ModalFooter>
                        <Button onClick={cancelDelete}>Cancel</Button>
                      <Button colorScheme='blue' mr={3} onClick={ deletedUserUpdate}>
                        Delete User
                        </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
    <Box mb="1em" display="flex" alignItems="center" gap="10px">
        
        {
             selected?.length > 0 && (
                <>
                <Text as="p" size="sm">
                {Object.keys(selectedRowIds).length} Selected
                 </Text>
                 <IconButton border="none" bg={'white'} onClick={clearSelect} size="sm" icon={<AiOutlineClose size="16px" color='black'/>} />
                <Box display="flex" gap="5px" alignItems="center">
                    <IconButton border="none" bg={'white'} size="sm" icon={<BsFillTrashFill size="16px" color='black' onClick={ deletedUser} />} />
                    {/* <Text as="p" size="sm">Delete</Text> */}
                </Box>
                </>
            )
        }
        
    </Box>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice(0, 10).map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      
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

const MasterProduct = () => {
    const [MasterChecked, setMasterChecked] = useState(false)
    const dispatch = useDispatch()
    const tempList = useSelector(listProduct);
    const selectedUser = useSelector(listProductSelection);
    const tableRef = React.useRef(null)
    const columns = React.useMemo(
    () => [
      {
        Header: "Product Id",
        accessor: "productId",
        Cell: ({ row }) => (
       
          <Link
            color="#065BAA"
            style={{textDecoration:"underline"}}
            to={`/product-detail/${row.original.productId}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.productId}
          </Link>
       
    ),
      },
      {
        Header: "Product Code",
        accessor: "productCode",
      },
      {
        Header: "Product Detail Code",
        accessor: "productDetailCode"
      },
      {
        Header: "Currency",
        accessor: "currency"
      },
      {
        Header: "Product Description",
        accessor: "productDescription"
      },
      {
        Header: "Personal Accident Cover",
        accessor: "personalAccidentCover"
      },
      {
        Header: "Medical Cover",
        accessor: "medicalCover"
      },
      {
        Header: "Travel Cover",
        accessor: "travelCover"
      },
      {
        Header: "Product Type",
        accessor: "productType"
      },
      {
        Header: "Travel Duration",
        accessor: "travelDuration"
      },
      {
        Header: "Additional Week",
        accessor: "additionalWeek"
      },
      {
        Header: "Updated Data",
        accessor: "updatedData"
      }
    ],
    []
  );
    const data = React.useMemo(() => tempList);
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
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Heading as={'h6'} size={'sm'}>Products</Heading>
                <Stack direction='row' spacing={4} m={'2.5'}>
                  <Box>
                    <InputGroup borderRadius={5} size="sm">
                      <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.600" />}
                      />
                      <Input type="text" placeholder="Search product id" border="1px solid #949494" />
                      <InputRightAddon
                        p={0}
                        border="none"
                      >
                      </InputRightAddon>
                    </InputGroup>
                  </Box>
                  <Link to="/master-data/create-product"> 
                    <Button variant="ClaimBtn" leftIcon={<AiOutlinePlusCircle />} colorScheme='#231F20' size={'sm'} color="white">
                        Add Product 
                    </Button>
                  </Link>
                </Stack>
            </Box>
            
            <Box bg="white" overflow={'scroll'} p="3">
                <Styles>
                <Tables columns={columns} data={data} />
                </Styles>
                {/* <Link to="/welcome">Back to Welcome</Link> */}
            </Box>
          </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default MasterProduct