import React from 'react';
import { useGetTemplateFilePriceQuery } from './productPriceApi';
import { Button } from '@chakra-ui/react';

const DownloadXLSButton = (props) => {
  const { data, error, isLoading } = useGetTemplateFilePriceQuery({
    skip: true,
  });

  const handleDownload = () => {
    if (data) {
      console.log('datass', data);
      const downloadLink = document.createElement('a');
      downloadLink.href = data;
      downloadLink.download = 'templateProudctPrice.xlsx'; // Set the desired file name and extension

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

  return (
    <div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Button onClick={handleDownload} disabled={!!error}>
          Download XLS
        </Button>
      )}
      {error && <span> {error.message}</span>}
    </div>
  );
};
export default DownloadXLSButton;
