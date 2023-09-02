/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Stack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { listvariant } from './masterProductSlice';
// import { SlCalender } from 'react-icons/sl';
import CommisionFormComponent from './commissiForm';

const EditProduct = () => {
  const listvariants = useSelector(listvariant);
  return (
    <Stack mt={{ base: '1em', md: '4em' }}>
      <CommisionFormComponent />
    </Stack>
  );
};
export default EditProduct;
