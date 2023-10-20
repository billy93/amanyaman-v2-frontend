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

  const revokeBlobUrl = (url) => {
    return new Promise((resolve) => {
      URL.revokeObjectURL(url);
      resolve();
    });
  };

  let cleanupPromise = Promise.resolve();
  const handleDownload = () => {
    if (data) {
      // Create a temporary link element to trigger the download
      const downloadLink = document.createElement('a');

      // Set the href to the blob URL
      downloadLink.href = data;

      // Set the desired file name and extension
      downloadLink.download = 'ProformaFiles.pdf';

      // Append the link to the DOM
      document.body.appendChild(downloadLink);

      // Wait for the cleanup of the previous download
      cleanupPromise.then(() => {
        // Trigger the download
        downloadLink.click();

        // Remove the link element from the DOM
        document.body.removeChild(downloadLink);

        // Clean up the blob URL
        URL.revokeObjectURL(data);

        // Create a new cleanup promise
        cleanupPromise = new Promise((resolve) => {
          setTimeout(resolve, 100); // Cleanup delay
        });
      });
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
