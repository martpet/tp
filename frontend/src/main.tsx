import '~/assets/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { App, IntlProvider, persistor, store, ThemeProvider } from '~/app';

const contaner = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(contaner).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <IntlProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </IntlProvider>
      </PersistGate>
    </ReduxProvider>
  </React.StrictMode>
);
