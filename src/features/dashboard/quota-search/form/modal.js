/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import PdfViewer from './pdfViewer';
import { useGetDetailBenefitQuery } from '../policyApiSlice';

const ModalForm = ({ isOpen, onClose, id }) => {
  const { data } = useGetDetailBenefitQuery(id);

  const downloadAndOpenPdfInNewTab = (pdfData) => {
    // Create a blob URL for the PDF data
    // const blob = new Blob([pdfData], { type: 'application/pdf' });
    // const data = URL.createObjectURL(blob);

    // Create a new tab
    const newTab = window.open();

    if (newTab) {
      // Create an iframe in the new tab and set its source to the PDF data URL
      const iframe = document.createElement('iframe');
      iframe.src = pdfData;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      newTab.document.body.appendChild(iframe);

      // Clean up the blob URL when the new tab is closed
      newTab.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(data);
      });
    } else {
      // Handle cases where the new tab couldn't be opened (e.g., due to popup blockers)
      console.error('Failed to open a new tab.');
    }
  };

  downloadAndOpenPdfInNewTab(data, 'benefit.pdf');
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <PdfViewer pdfArrayBuffer={data} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalForm;
