/* eslint-disable no-unused-vars */
import React from 'react';
import { useDownloadProformaQuery } from './policyApiSlice';
import { Button, MenuItem, Box, Text } from '@chakra-ui/react';
import { AiOutlineDownload } from 'react-icons/ai';

const DownloadXLSButton = ({ id }) => {
  // const [trigger, setTrigger] = React.useState(true);
  // console.log('id', id);
  const { data, error, isLoading } = useDownloadProformaQuery(id);

  const handleTrigger = async () => {
    // setTrigger(false);
    await handleDownload();
  };

  const handleDownload = () => {
    if (data) {
      console.log('data', data);
      console.log('data', data.url);
      // Create a temporary link element to trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = data.url; // Assuming your response has a URL field
      downloadLink.download = 'ProformaFiles.pdf'; // Set the desired file name and extension

      // Append the link to the DOM
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Remove the link element from the DOM after a short delay
      setTimeout(() => {
        document.body.removeChild(downloadLink);
      }, 1000);
    }
  };

  return (
    <MenuItem onClick={handleDownload}>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Box gap="5px" display={'flex'} alignItems="center">
          <AiOutlineDownload color="#065BAA" size={'16px'} />
          <Text as="p" fontSize="xs">
            Download Proforma Invoice
          </Text>
        </Box>
        // <Button
        //   onClick={handleDownload}
        //   disabled={!!error}
        //   leftIcon={<MdLogin />}
        //   colorScheme="#231F20"
        //   variant="outline"
        //   size={'sm'}
        //   color="#231F20"
        // >
        //   Export All
        // </Button>
      )}
      {error && <span> {error.message}</span>}
    </MenuItem>
  );
};
export default DownloadXLSButton;
