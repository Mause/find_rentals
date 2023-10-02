import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SWRConfig } from 'swr';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import Inspections from './Inspections';
import axios from 'axios';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

function AppWrapper() {
  return window.location.pathname.includes('inspections') ? (
    <Inspections />
  ) : (
    <App />
  );
}

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (key) =>
          axios.get(key, { responseType: 'json' }).then(({ data }) => data),
      }}
    >
      <AppWrapper />
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
