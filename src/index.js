import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createStandaloneToast } from '@chakra-ui/react'
import { defaultTheme } from './theme';
import '@coreui/coreui/dist/css/coreui.min.css'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { store } from './app/store'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const { ToastContainer, toast } = createStandaloneToast()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}
      // toastOptions={{ defaultOptions: { position: 'top-right' } }}
    >
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
toast({
  title: 'An error occurred.',
  description: 'Unable to create user account.',
  status: 'error',
  duration: 9000,
  isClosable: true,
})