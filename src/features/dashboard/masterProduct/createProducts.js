/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Stack } from '@chakra-ui/react';

// import { SlCalender } from 'react-icons/sl';
import CommisionFormComponent from './createCommisionForm';

const CreateProduct = () => {
  return (
    <Stack mt={{ base: '1em', md: '5em' }}>
      <CommisionFormComponent />
    </Stack>
  );
};
export default CreateProduct;
