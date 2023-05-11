import React, { useState,useRef }  from 'react';
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectClaimType, setFormState,selectCurrentStep,setFormStateLocation,selectedTimeLocation,setFormStateExpenses,expenses,defaultForm } from '../createClaimSlice'
// import { InputProps, SchemaForm } from '../types'
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import {
Box,
Button,
Input,
FormControl,
FormLabel,
Select,
IconButton,
Text
} from '@chakra-ui/react'
import {MdAdd} from 'react-icons/md'
import {BsFillTrash3Fill} from 'react-icons/bs'
import {SlCalender} from 'react-icons/sl'


let renderCount = 0;
const Form = ({getFormValue,expensesState}) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch()
  const current = useSelector(selectCurrentStep)
  const expensesData = useSelector(expenses)
  const defaultForms = useSelector(defaultForm)
  const [formValues, setFormValues] = useState([{ incidentDate: null, provider: "", amount: "" }])
  const [isActive, setActive] = useState(false)
  const [isActiveProvider, setProviderActive] = useState(false)
  // const ref = React.useRef();

  let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
        getFormValue(newFormValues)
      }
    let addFormFields = () => {
        setFormValues([...formValues, {incidentDate: null, provider : "", amount:""}])
      }
    
    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
   console.log('expensesState',expensesState)
    return (
      <Box>
        
          {formValues.map((element, index) => (
            <div className="form-inline" key={index}>
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} m="1em" w={{ base: "100%", md: "460px" }}>
                <Text as="b" fontSize={'sm'}>
                  Expenses {index + 1}
                </Text>
                <IconButton aria-label='Search database' icon={<BsFillTrash3Fill size="1em"/>} onClick={() => removeFormFields(index)}/>
                {/* <BsFillTrash3Fill size="1em" onClick={() => removeFormFields(index)}/> */}
              </Box>
              <Box width={{base:"100%",md:"460px"}} m="1em"> 
                <FormControl defaultValue={element.incidentDate} variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input
                  type="date"
                  name="incidentDate"
                  value={element.incidentDate}
                  onChange={e => handleChange(index, e)}
                  placeholder="Select incident date" // placeholder
                  // ref={inputRef}
                  h="47px"
                  // ref={ref}
                />
                    <FormLabel fontSize="12" pt="1.5" className={isActiveProvider ? "" : ""} fontFamily={'Mulish'} style={{ fontSize: '14px' }}>Receipt Provider</FormLabel>
                  </FormControl>
              </Box>
              <Box width={{ base: "100%", md: "460px" }} m="1em">
                 <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input placeholder=" " type="text" name="provider" value={element.provider || ""} onChange={e => handleChange(index, e)} h="48px"/>
                    <FormLabel fontSize="12" pt="1.5" className={isActiveProvider ? "" : ""} fontFamily={'Mulish'} style={{ fontSize: '14px' }}>Receipt Provider</FormLabel>
                  </FormControl>
              </Box>
              <Box width={{ base: "100%", md: "460px" }} m="1em">
                <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                     <Box display="flex">
                      <Select placeholder='' h="48px" w={{base:"100%", md:"38%"}}>
                        <option value='IDR'>IDR</option>
                        <option value='MY'>MY</option>
                        <option value='SGD'>SGD</option>
                        <option value='USD'>USD</option>
                      </Select>
                     <Input type="number" name="amount" value={element.amount || ""} onChange={e => handleChange(index, e)} h="48px"/>  
                     </Box>
                    {/* <FormLabel fontSize="12" pt="1.5" className={isActiveProvider ? "Active" : ""} fontFamily={'Mulish'} style={{ fontSize: '14px' }}>Description Location</FormLabel> */}
                  </FormControl>
             
              </Box>
              {/* <input type="text" name="name" value={element.name || ""} onChange={e => handleChange(index, e)} /> */}
              
            </div>
          ))}
          <Box className="button-section" w={{base:"100%", md:"460px"}} m="1em">
              <Button w="100%" variant="base" className="button add" type="button" h="48px" onClick={() => addFormFields()}><MdAdd size="1em" /> Add Expense</Button>
              {/* <button className="button submit" type="submit">Submit</button> */}
          </Box>
      </Box>
    )
 }
export default Form