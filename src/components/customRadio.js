import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from '@chakra-ui/react';
import {
  editAgentVal,
  setEditAgent,
} from '../features/dashboard/travelAgent/travelAgentSlice';

const CustomRadio = () => {
  const dispatch = useDispatch();
  const defaultVal = useSelector(editAgentVal);

  const handleCheckboxChange = () => {
    const edit = {
      ...defaultVal,
      allowCreditPayment: !defaultVal?.allowCreditPayment,
    };
    dispatch(setEditAgent(edit));
  };
  return (
    <div>
      <Checkbox
        isChecked={defaultVal !== null ? defaultVal?.allowCreditPayment : false}
        onChange={handleCheckboxChange}
        borderRadius={'50%'}
      >
        Allow Credit Payment
      </Checkbox>
      {/* <div>Is Allow checked: {defaultVal?.allowCreditPayment ? 'true' : 'false'}</div> */}
    </div>
  );
};

export default CustomRadio;
