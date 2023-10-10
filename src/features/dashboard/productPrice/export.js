import React from 'react';
import { useExportProductPriceQuery } from './productPriceApi';
import { Button } from '@chakra-ui/react';
import { MdLogin } from 'react-icons/md';

const DownloadXLSButton = ({ params, page, size }) => {
  const { data, error, isLoading } = useExportProductPriceQuery({
    page: page,
    size: size,
    ...params,
  });

  const handleDownload = () => {
    if (data) {
      console.log('datass', data);
      const downloadLink = document.createElement('a');
      downloadLink.href = data;
      downloadLink.download = 'exportProudctPrice.xlsx'; // Set the desired file name and extension

      // Append the link to the DOM
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Remove the link element from the DOM after a short delay
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        // Clean up the blob URL
        URL.revokeObjectURL(data);
      }, 1000);
    }
  };
  console.log('error', error);
  console.log('data', data);
  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Button
          onClick={handleDownload}
          // disabled={!!error}
          leftIcon={<MdLogin />}
          colorScheme="#231F20"
          variant="outline"
          size={'sm'}
        >
          Export
        </Button>
      )}
      {error && <span> {error.message}</span>}
    </>
  );
};
export default DownloadXLSButton;
