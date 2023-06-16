import { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useRadioGroup, Radio,Checkbox } from '@chakra-ui/react';
import { formAgent,setFormAgent } from '../features/dashboard/travelAgent/travelAgentSlice'

const CustomRadioCreate = () => {
  const dispatch = useDispatch()
  const defaultVal = useSelector(formAgent)
  const [isAllowed, setIsAllowed] = useState(formAgent?.allowCreditPayment);

  const handleCheckboxChange = () => {
    const edit = {
      ...defaultVal,
      allowCreditPayment:!defaultVal?.allowCreditPayment
    }
    dispatch(setFormAgent(edit))
  };
console.log('isAllowed', defaultVal?.allowCreditPayment)
console.log('isAllowed', isAllowed)
  return (
    <div>
     <Checkbox isChecked={defaultVal !== null ? defaultVal?.allowCreditPayment : false} onChange={handleCheckboxChange} borderRadius={'50%'}>
        Allow Credit Payment
      </Checkbox>
      {/* <div>Is Allow checked: {defaultVal?.allowCreditPayment ? 'true' : 'false'}</div> */}
    </div>
  );
};

export default CustomRadioCreate;
