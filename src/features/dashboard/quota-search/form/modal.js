/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useGetDetailBenefitQuery } from '../policyApiSlice';

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfModal = ({ isOpen, onClose, id, download }) => {
  const { data } = useGetDetailBenefitQuery(id);
  const [numPages, setNumPages] = React.useState(null);
  const [width, setWidth] = React.useState(500); // Default width

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const iframeRef = React.useRef(null);

  const handleIframeLoad = () => {
    // Access the iframe's contentDocument and body
    const iframeDoc = iframeRef.current.contentDocument;
    const iframeBody = iframeDoc.body;

    // Add your custom iframe styles here if needed
    iframeRef.current.style.width = '100vw';
    iframeRef.current.style.height = '100vh';

    // Clean up the iframe when the modal is closed
    // onClose && onClose();

    // Clean up any event listeners or resources as needed
    // You can use the 'beforeunload' event if required
  };

  // Calculate responsive width based on the modal content width
  const modalContentWidth = 60; // Percentage of modal width
  React.useEffect(() => {
    const maxWidth = window.innerWidth * (modalContentWidth / 100);
    setWidth(maxWidth);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent maxW={`${modalContentWidth}vw`}>
        <ModalHeader>PDF Viewer</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxH="80vh">
          {/* {data ? (
            <Document
              file={data}
              onLoadSuccess={onDocumentLoadSuccess}
              width={width}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={width}
                />
              ))}
            </Document>
          ) : (
            <p>Loading PDF...</p>
          )} */}
          <iframe
            ref={iframeRef}
            src={data}
            title="Embedded Content"
            width="800px"
            height="600px"
            frameBorder="0"
            onLoad={handleIframeLoad}
            scrolling="no"
          ></iframe>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          {data && (
            <Button colorScheme="green" onClick={() => download(data)}>
              Download
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PdfModal;
