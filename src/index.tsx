import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './routers/App';
import './index.css';
import * as serviceWorker from './sw/serviceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
serviceWorker.unregister();
