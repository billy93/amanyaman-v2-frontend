import React from 'react'
import { useGetTemplateFileQuery } from './userApiSlice'
import { Button } from '@chakra-ui/react'

const DownloadXLSButton = (props) => {
    const [trigger, setTrigger] = React.useState(false)
    const { data, error, isLoading } = useGetTemplateFileQuery('/path/to/blob',{
      skip: trigger ===false
  });

  const handleDownload = () => {
    setTrigger(true)
    if (data) {
    //  const blobUrl = URL.createObjectURL(blobData);

    // Create a download link element
    const downloadLink = document.createElement('a');
    downloadLink.href = data;
    downloadLink.download = 'dataUser.xlsx'; // Set the desired file name and extension

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
    };
}
  return (
    <div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Button onClick={handleDownload} disabled={!!error}>
          Download Template
        </Button>
      )}
      {error && <span> {error.message}</span>}
    </div>
  );
};
export default DownloadXLSButton;

