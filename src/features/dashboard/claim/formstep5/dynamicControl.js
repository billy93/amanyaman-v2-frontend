
import React, {forwardRef} from 'react'
import { useFormContext } from "react-hook-form";
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import {
Box,
Stack,
Text,
Heading,
Button,
Image,
FormControl,
Input,
FormLabel,
InputGroup,
InputRightElement,
Select,
Divider,
Textarea,
Center
} from '@chakra-ui/react'
import { SlCalender } from 'react-icons/sl'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import { defaultForm, addEpensesForm, selectCurrentStep,setFormStateLocation } from '../createClaimSlice'


const renderCustomInput = React.forwardRef(( props,ref ) => {
    <>
    <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'}>
      <InputGroup id="float-label">
        <Input readOnly ref={ref} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={''} h="48px" />
        <InputRightElement children={<SlCalender color='green.500' />} />
         {/* <FormLabel fontSize="12" pt="1.5" className={ isActive || locationData?.expirationDate ? "Active" : ""} fontFamily={'Mulish'}>Expiration Date</FormLabel> */}
      </InputGroup>
         {/* It is important that the Label comes after the Control due to css selectors */}
    </FormControl>
    </>
})
// const formatInputValue = () => {
//     if (!locationData?.expirationDate) return '';
//     return `${locationData?.expirationDate?.day} ${getMonthName(locationData?.expirationDate?.month)} ${locationData?.expirationDate?.year}`;
//   };
export const DynamicControl = ({
  inputType,
  fieldName,
  defaultValue,
  options = [],
  config = {},
  setFormStateExpenses
}) => {
  const { register } = useFormContext();
  const dispatch = useDispatch()
  const current = useSelector(selectCurrentStep)
  // console.log('handleChange', handleChange)
  const handleChange = (date) => {
    console.log('es', date)
    // console.log('i', i)
    const dateData = {
                incidentDate:{...date},
                provider:"",
                amount:""
    }
    const data = {
      step: current,
      expenses: [{
        incidentDate: { ...date },
        provider: "",
        amount: ""
      }
      ]
    }
    dispatch(setFormStateLocation(data))
  }
  switch (inputType) {
    case "text":
      return (
        <input
          id={fieldName}
          type="text"
          {...register(fieldName, config)}
          defaultValue={defaultValue}
        />
      );
    case "select": {
      return (
        <select
          {...register(fieldName, config)}
          defaultValue={defaultValue}
          name={fieldName}
          id={fieldName}
        >
          {options.map((o, index) => (
            <option key={index} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    case "number":
      return (
        <input
          type="number"
          id={fieldName}
          {...register(fieldName, config)}
          defaultValue={defaultValue}
        />
      );
    case "date":
      const ref = React.createRef();
      return (
        <DatePicker
        {...register(fieldName, config)}
              value={defaultValue}
              onChange={handleChange}
              inputPlaceholder="Select a date" // placeholder
              // formatInputText={formatInputValue} 
              inputClassName="my-custom-input" // custom class
              // renderInput={renderCustomInput} 
              shouldHighlightWeekends
              name={fieldName}
              id={fieldName}
              ref={ref}
              />
        // <input
        //   type="number"
        //   id={fieldName}
        //   {...register(fieldName, config)}
        //   defaultValue={defaultValue}
        // />
      );
    default:
      return <input type="text" />;
  }
};
