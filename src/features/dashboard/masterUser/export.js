import React from 'react'
import { useExportUserdataMutation } from './userApiSlice'
import { Button } from '@chakra-ui/react'
import { MdLogin } from 'react-icons/md'

const DownloadXLSButton = (props) => {
    const [trigger, setTrigger] = React.useState(false)
    const [exportUserdata,{ data, error, isLoading,isSuccess }] = useExportUserdataMutation('/path/to/blob',{
      skip: trigger ===false
  });

    const handleDownload = React.useCallback(() => {
      if (data) {
    //  const blobUrl = URL.createObjectURL(blobData);

    // Create a download link element
    const downloadLink = document.createElement('a');
    downloadLink.href = data;
    downloadLink.download = 'exportDataUser.xlsx'; // Set the desired file name and extension

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
    }, [data])
    
    const handleExport = async () => {
        setTrigger(true)
        try {
            await exportUserdata()
           
        } catch (error) {
            console.log(error)
        }
    } 

    React.useEffect(() => {
         if (isSuccess && trigger) {
            handleDownload()
        }
    }, [isSuccess, handleDownload,trigger])
    
  return (
    <div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Button onClick={handleExport} disabled={!!error} leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20" isLoading={isLoading}>
            Export 
        </Button>
      )}
      {error && <span> {error.message}</span>}
    </div>
  );
};
export default DownloadXLSButton;

