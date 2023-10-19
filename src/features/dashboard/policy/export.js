import React from 'react';
import { useExportPolicyQuery } from './policyApiSlice';
import { Button } from '@chakra-ui/react';
import { MdLogin } from 'react-icons/md';

const DownloadXLSButton = ({ query, page, size }) => {
  const { data, error, isLoading } = useExportPolicyQuery(
    {
      skip: true,
    },
    { page, size: size, ...query }
  );

  const handleDownload = () => {
    if (data) {
      const downloadLink = document.createElement('a');
      downloadLink.href = data;
      downloadLink.download = 'ExportPolicies.xlsx'; // Set the desired file name and extension

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
        <Button
          onClick={handleDownload}
          disabled={!!error}
          leftIcon={<MdLogin />}
          colorScheme="#231F20"
          variant="outline"
          size={'sm'}
          color="#231F20"
        >
          Export All
        </Button>
      )}
      {error && <span> {error.message}</span>}
    </div>
  );
};
export default DownloadXLSButton;
