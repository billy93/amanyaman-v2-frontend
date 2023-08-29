import React, { Fragment } from 'react';
import { Spinner, Box } from '@chakra-ui/react';

const PageLoader = ({ loading }) => (
  <Fragment>
    {loading ? (
      <Box
        className="overlay"
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        h="100vh"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    ) : null}
  </Fragment>
);

export default PageLoader;
