/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TagsInput } from 'react-tag-input-component';
import Autosuggest from 'react-autosuggest';
import { Box, Text, Button } from '@chakra-ui/react';
import { setStateMessage } from './policySlice';
import { useResendEmailsMutation } from './policyApiSlice';
import UseCustomToast from '../../../components/UseCustomToast';

const EmailForm = ({ quotation, handleClose }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [suggestions, setSuggestions] = useState([
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'example.com',
  ]); // Your list of email domain suggestions
  const [sendEmails, { isLoading, status }] = useResendEmailsMutation();
  const { id, policyNumberString } = useParams();
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleSendEmails = async () => {
    const data = {
      bookingId: id,
      travellerId: getTravellerId(policyNumberString),
      to: [...selected],
    };
    // console.log('data', data);
    try {
      const response = await sendEmails(data);

      console.log(response);
    } catch (error) {
      console.log(error);
      // dispatch(setStateMessage(error?.error?.status === 400 ? 'error' : ''));
    }
  };

  const handleTagsChange = (tags) => {
    setSelected(tags);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleSpaceKeyPress = (e) => {
    if (e.key === ' ' && inputValue.trim() !== '') {
      const newSelected = [...selected, inputValue.trim()];
      setSelected(newSelected);
      setInputValue('');
    }
  };

  React.useEffect(() => {
    if (status === 'fulfilled') {
      showSuccessToast('Successfully', 'sendemail');
      dispatch(setStateMessage(status));
      handleClose();
    }
    if (status === 'rejected') {
      showErrorToast('Error', 'sendemail');
      dispatch(setStateMessage(status));
    }
  }, [status, dispatch]);

  const getTravellerId = React.useCallback(
    (type) => {
      let idTraveller;
      if (type) {
        let data = quotation?.travellers.filter(
          (quotation) => quotation.policyNumber === type
        );
        // console.log('ddddd', data);
        idTraveller = data[0]?.id;
      } else {
        idTraveller = quotation && quotation[0]?.travellers[0].id;
      }
      return idTraveller;
    },
    [quotation]
  );

  React.useEffect(() => {
    getTravellerId(policyNumberString);
  }, [policyNumberString, getTravellerId]);

  // console.log('quotation', status);
  // console.log('dd', getTravellerId(policyNumberString));
  return (
    <Box>
      <Box>
        <Box>
          <TagsInput
            value={selected}
            onChange={handleTagsChange}
            name="email"
            placeholder="Enter email"
            onKeyPress={handleSpaceKeyPress}
            inputValue={inputValue}
            onInputChange={handleInputChange}
          />
          <Text as="b" fontSize="sm">
            press enter or comma to add new tag
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button
            variant="outline"
            isLoading={isLoading}
            onClick={handleSendEmails}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailForm;
