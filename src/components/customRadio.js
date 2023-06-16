import { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useRadioGroup, Radio,Checkbox } from '@chakra-ui/react';
import { editAgentVal,setEditAgent } from '../features/dashboard/travelAgent/travelAgentSlice'

const CustomRadio = () => {
  const dispatch = useDispatch()
  const defaultVal = useSelector(editAgentVal)
  const [isAllowed, setIsAllowed] = useState(editAgentVal?.allowCreditPayment);

  const handleCheckboxChange = () => {
    const edit = {
      ...defaultVal,
      allowCreditPayment:!defaultVal?.allowCreditPayment
    }
    dispatch(setEditAgent(edit))
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

export default CustomRadio;
