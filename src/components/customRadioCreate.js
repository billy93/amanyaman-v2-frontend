import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from '@chakra-ui/react';
import {
  formAgent,
  setFormAgent,
} from '../features/dashboard/travelAgent/travelAgentSlice';

const CustomRadioCreate = () => {
  const dispatch = useDispatch();
  const defaultVal = useSelector(formAgent);

  const handleCheckboxChange = () => {
    const edit = {
      ...defaultVal,
      allowCreditPayment: !defaultVal?.allowCreditPayment,
    };
    dispatch(setFormAgent(edit));
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

export default CustomRadioCreate;
