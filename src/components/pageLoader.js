import React, { Fragment } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { HashLoader } from 'react-spinners';

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
        <Center
          d="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
        >
          <HashLoader
            color="#36d7b7"
            size={50}
            loading={loading}
            speedMultiplier={300}
          />
        </Center>
      </Box>
    ) : null}
  </Fragment>
);

export default PageLoader;
