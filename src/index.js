import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { createStandaloneToast, Center, Box } from '@chakra-ui/react';
import { defaultTheme } from './theme';
import '@coreui/coreui/dist/css/coreui.min.css';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
const { ToastContainer } = createStandaloneToast();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider
      theme={defaultTheme}
      // toastOptions={{ defaultOptions: { position: 'top-right' } }}
    >
      <Provider store={store}>
        <PersistGate
          loading={
            <Box
              className="overlay"
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              h="100vh"
            >
              <HashLoader
                color="#50b848"
                size={50}
                loading={true}
                speedMultiplier={1}
              />
            </Box>
          }
          persistor={persistor}
        >
          {/* <ApiProvider api={apiSlice}>     */}
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
          {/* </ApiProvider> */}
          <ToastContainer />
        </PersistGate>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
// toast({
//   title: 'An error occurred.',
//   description: 'Unable to create user account.',
//   status: 'error',
//   duration: 9000,
//   isClosable: true,
// });
