/* eslint-disable no-unused-vars */
// PdfViewer.js
import React, { useEffect } from 'react';
import { useGetDetailBenefitQuery } from '../policyApiSlice';
import { Document, Page } from 'react-pdf';

function PdfViewer({ pdfId }) {
  const { data, error, isLoading } = useGetDetailBenefitQuery(pdfId);

  return (
    <div>
      {isLoading ? (
        <p>Loading PDF...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <Document file={{ data }}>
          <Page pageNumber={1} />
        </Document>
      ) : null}
    </div>
  );
}

export default PdfViewer;
