import React from 'react'
import { useGetTemplateFileQuery } from './userApiSlice'
import { Button } from '@chakra-ui/react'

const DownloadXLSButton = (props) => {
    const [trigger, setTrigger] = React.useState(false)
    const { data, error, isLoading } = useGetTemplateFileQuery({
      skip: trigger ===false
  });
  const handleClick = (e) => {
    e.preventDefault()
    setTrigger(!trigger)
    handleDownload()
  }
  const handleDownload = () => {
    if (data) {
       console.log('dass', data)
      const downloadLink = document.createElement('a');
      downloadLink.href = data;
      downloadLink.download = 'templateUser.xlsx'; // Set the desired file name and extension

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
  }
  console.log('datadatadata', data)
  return (
    <div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Button onClick={handleClick} disabled={!!error}>
          Download Template
        </Button>
      )}
      {error && <span> {error.message}</span>}
    </div>
  );
};
export default DownloadXLSButton;

