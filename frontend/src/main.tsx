import React from 'react';
import ReactDOM from 'react-dom/client';

// import { Provider } from 'react-redux';
import { App } from '~/components';
// import { store } from '~/store';

const contaner = document.getElementById('root');

if (!contaner) {
  console.error('Container element is missing');
} else {
  ReactDOM.createRoot(contaner).render(
    <React.StrictMode>
      {/* <Provider store={store}> */}
      <App />
      {/* </Provider> */}
    </React.StrictMode>
  );
}
