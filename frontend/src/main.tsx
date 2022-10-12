import '~/assets/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { IntlProvider, persistor, store, ThemeProvider } from '~/app';
import { App } from '~/features/app';

const contaner = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(contaner).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <IntlProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </IntlProvider>
      </PersistGate>
    </ReduxProvider>
  </React.StrictMode>
);
