import React from "react";
import styled from "styled-components";
import {Link} from 'react-router-dom' 
import { useTable, usePagination, useGlobalFilter,useRowSelect } from "react-table";
import { listProduct,setMasterProduct,setListSelectProduct,listProductSelection } from './masterProductSlice'
import { useSelector,useDispatch } from 'react-redux'
import {
useToast,
Modal,
Button,
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
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import {BiSkipPreviousCircle,BiSkipNextCircle} from 'react-icons/bi'
import { Search2Icon } from "@chakra-ui/icons";
// A great library for fuzzy filtering/sorting items

// import makeData from "./mockdata";

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

    th{
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
    font-family:"Mulish";
    },
    td {
      background-color: #fff;
      font-family:"Mulish";
      color: #231F20;
      padding: 13px 15px;
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      text-align: left;
      white-space: nowrap;
      font-weight: normal;
      min-width: 40px;
      vertical-align: bottom;
      background-clip: padding-box;
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

// Our table component
function Table({ columns, data }) {
  const props = useTable(
    {
      columns,
      data
    },
    useGlobalFilter, // useGlobalFilter!
    usePagination,
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()
  const toast = useToast()
  const selected = useSelector(listProductSelection)
  const listuser = useSelector(listProduct)

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
  
  // Render the UI for your table
    const getValues = (data) => {
     let original = data.map((item) => item.original)
     dispatch(setListSelectProduct(original))
    }
    
    const deletedUserUpdate = (e) => {
        e.preventDefault()
        const nextState = listuser.filter(
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
     const clearSelect = () => {
     dispatch(setListSelectProduct([]))
     onClose()
     const rowIds = listuser?.map((item,i) =>i);
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
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
    selectedFlatRows,
    toggleAllRowsSelected,
    toggleRowSelected,
    state: { pageIndex, pageSize, globalFilter,selectedRowIds }
  } = props;
  
  React.useEffect(() => {
    // props.dispatch({ type: actions.resetPage })
    console.log(globalFilter);
  }, [globalFilter]);

 const prev = usePrevious(selectedRowIds)
  React.useEffect(() => {
      toggleAllRowsSelected();
  }, []);
    
  React.useEffect(() => {
      if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
          getValues(selectedFlatRows)
      }
  }, [prev, selectedRowIds]);

  return (
    <Box mt="5em" pl="2em" pr="2em">
     <Modal size="xl" blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="56rem">
                <ModalHeader>
                    <Heading variant="primary" as="div" size="lg" fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'18px'}}>
                        Delete Product
                    </Heading>
                    <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'14px'}} fontWeight={'normal'}>
                        {/* You’re about to delete {selected && selected?.length > 0} product: */}
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
                                    selected && selected?.map((item, i) => {
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
                        Delete Product
                        </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Heading as={'h6'} size={'sm'}>Products</Heading>
                <Stack direction='row' spacing={4} m={'2.5'}>
                  <Box>
                    <InputGroup borderRadius={5} size="sm">
                      <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.600" />}
                      />
              <Input
                value={globalFilter || ""}
                onChange={e => setGlobalFilter(e.target.value)}
                type="text" placeholder="Search product id" border="1px solid #949494" />
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
      <Box bg="white" overflow={'scroll'} p="3">
      <table {...getTableProps()} >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </Box>
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
          <Button _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius:"5px"
        }} onClick={() => nextPage()} disabled={!canNextPage} bg="white" border={'none'}>
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

      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </Box>
  );
}

function MasterProduct() {
  const list = useSelector(listProduct)
  // const [loading, setLoading] = React.useState(false)
  const columns = React.useMemo(
    () => [
      {
        Header: "Product Id",
        accessor: "productId",
        filter: 'fuzzyText',
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
        enableGlobalFilter: true, 
      },
      {
        Header: "Product Detail Code",
        accessor: "productDetailCode",
        enableGlobalFilter: true, 
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
        accessor: "productType",
        enableGlobalFilter: true, 
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

  // const data = React.useMemo(() => makeData(100), []);
  const [data, setData] = React.useState(list);

  // React.useEffect(() => {
  //   setData(makeData(100));
  // }, []);
  

  return (
      <Styles>
        {/* <button onClick={handleReset}>Reset Data</button> */}
        <Table columns={columns} data={data} />
      </Styles>
  );
}

export default MasterProduct;
