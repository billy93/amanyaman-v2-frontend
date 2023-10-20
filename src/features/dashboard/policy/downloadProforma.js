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

  // let cleanupPromise = Promise.resolve();

  const revokeBlobUrl = (url) => {
    return new Promise((resolve) => {
      URL.revokeObjectURL(url);
      resolve();
    });
  };

  const handleDownload = async () => {
    if (data) {
      const downloadLink = document.createElement('a');
      downloadLink.href = data;
      downloadLink.download = 'ProformaFiles.pdf';

      document.body.appendChild(downloadLink);

      await revokeBlobUrl(data); // Ensure the blob URL is revoked before moving on

      downloadLink.click();
      document.body.removeChild(downloadLink);
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
