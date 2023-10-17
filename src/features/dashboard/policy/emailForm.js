/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
// import { TagsInput } from 'react-tag-input-component';
import TagsInput from 'react-tagsinput';
import Autosuggest from 'react-autosuggest';
import { Box, Text, Button } from '@chakra-ui/react';
import { setStateMessage } from './policySlice';
import { useResendEmailsMutation } from './policyApiSlice';
import UseCustomToast from '../../../components/UseCustomToast';
import 'react-tagsinput/react-tagsinput.css';

const EmailForm = ({ quotation, handleClose }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const sendButtonRef = useRef(null);
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
    console.log('va', value);
    setInputValue(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Tab' && inputValue.trim() !== '') {
      e.preventDefault(); // Prevent the default behavior of the Tab key
      const newSelected = [...selected, inputValue.trim()];
      setSelected(newSelected);
      setInputValue('');
    } else if (e.key === 'Enter' || e.key === ',') {
      if (inputValue.trim() !== '') {
        const newSelected = [...selected, inputValue.trim()];
        setSelected(newSelected);
        setInputValue('');
      }
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

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && inputValue.trim() !== '') {
      e.preventDefault(); // Prevent the default behavior of the Tab key
      const newSelected = [...selected, inputValue.trim()];
      setSelected(newSelected);
      setInputValue('');
      sendButtonRef.current.focus(); // Move focus to the "Send" button
    }
  };

  // console.log('quotation', status);
  // console.log('dd', getTravellerId(policyNumberString));
  return (
    <Box>
      <Box>
        <Box>
          {/* <TagsInput
            value={selected}
            onChange={handleTagsChange}
            name="email"
            placeholder="Enter email"
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyDown}
            tabIndex="1" // Prevent TagsInput from being included in the tab order
          /> */}
          <TagsInput value={selected} onChange={handleTagsChange} addKeys />
          <Text as="b" fontSize="sm">
            press enter or comma to add new tag
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button
            ref={sendButtonRef}
            tabIndex={'2'}
            variant="outline"
            isLoading={isLoading}
            onClick={handleSendEmails}
            // id="sendButton"
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailForm;
