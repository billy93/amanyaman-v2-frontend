import { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useRadioGroup, Radio } from '@chakra-ui/react';
import { editAgentVal,setEditAgent } from '../features/dashboard/travelAgent/travelAgentSlice'

const CustomRadio = () => {
  const [isAllowed, setIsAllowed] = useState(true);
  const defaultval = useSelector(editAgentVal)
  const dispatch =useDispatch()
  
  const handleRadioChange = () => {
    setIsAllowed((prevIsAllowed) => !prevIsAllowed);
  };
    
  return (
    <div>
      <Radio value={isAllowed} onChange={handleRadioChange}>
        {isAllowed ? 'Allow' : 'Deny'}
      </Radio>
      <div>Is Allow checked: {isAllowed ? 'true' : 'false'}</div>
    </div>
  );
};

export default CustomRadio;
