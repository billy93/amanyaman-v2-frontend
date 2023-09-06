import React from 'react';
import { Document, Page } from 'react-pdf';

const PdfViewer = ({ pdfArrayBuffer }) => {
  const [uint8Arr, setUint8Arr] = React.useState();
  // Ensure that pdfArrayBuffer is a valid ArrayBuffer
  if (!(pdfArrayBuffer instanceof ArrayBuffer)) {
    return <div>Invalid PDF data</div>;
  }
  function getUint8Array() {
    let reader = new FileReader();

    // reader.readAsDataURL(selectedFile); base64
    reader.readAsArrayBuffer(pdfArrayBuffer);
    reader.onloadend = async (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        const uint8Array = new Uint8Array(e.target.result);
        setUint8Arr(uint8Array);

        // more callbacks(file.name, Buffer.from(new Uint8Array(target.result)));
      }
    };
  }
  getUint8Array();

  return (
    <div className="pdf-container">
      <Document
        file={{
          data: uint8Arr, // Pass the Uint8Array containing the PDF data
        }}
      >
        <Page pageNumber={1} /> {/* Display the first page */}
      </Document>
    </div>
  );
};

export default PdfViewer;
