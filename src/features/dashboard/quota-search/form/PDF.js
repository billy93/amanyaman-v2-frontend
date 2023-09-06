/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Import the PDF.js library
importScripts('pdfjs-dist/build/pdf.js');
importScripts('pdfjs-dist/build/pdf.worker.js');

// Initialize PDF.js
const { PDFWorker } = pdfjsLib;
PDFWorker.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

// Create a message handler to process PDF tasks
self.addEventListener('message', (event) => {
  const { data } = event;

  // Initialize the PDFWorker
  const pdfWorker = new PDFWorker();

  // Process the PDF task
  pdfWorker.messageHandler({
    data,
    callback: (result) => {
      // Send the result back to the main thread
      self.postMessage(result);
    },
  });
});
