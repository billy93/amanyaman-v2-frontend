import React from 'react';
import { useExportFileQuery } from './masterProductApiSlice';
import { Button } from '@chakra-ui/react';
import { MdLogin } from 'react-icons/md';

const DownloadXLSButton = ({ params, page, size }) => {
  const [trigger, setTrigger] = React.useState(true);
  const { data, error, isLoading } = useExportFileQuery(
    { page, size: size, ...params },
    {
      skip: trigger === true,
    }
  );

  const handleExport = () => {
    setTrigger(false);
  };

  const handleDownload = React.useCallback(() => {
    if (data) {
      //  const blobUrl = URL.createObjectURL(blobData);
      console.log('data', data);
      // Create a download link element
      const downloadLink = document.createElement('a');
      downloadLink.href = data;
      downloadLink.download = 'exportDataProducts.xlsx'; // Set the desired file name and extension

      // Append the link to the DOM
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Remove the link element from the DOM after a short delay
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        // Clean up the blob URL
        URL.revokeObjectURL(data);
        setTrigger(true);
      }, 1000);
    }
  }, [data]);

  console.log('data', data);
  React.useEffect(() => {
    if (!trigger) {
      handleDownload();
    }
  }, [handleDownload, trigger]);

  return (
    <div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Button
          onClick={handleExport}
          disabled={!!error}
          leftIcon={<MdLogin />}
          colorScheme="#231F20"
          variant="outline"
          size={'sm'}
          color="#231F20"
          isLoading={isLoading}
        >
          Export
        </Button>
      )}
      {error && <span> {error.message}</span>}
    </div>
  );
};
export default DownloadXLSButton;
