import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './routers/App';
import './index.css';
import registerServiceWorker from './sw/registerServiceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
