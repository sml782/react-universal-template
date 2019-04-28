import * as React from 'react';
import { Button } from 'antd';
import logoSvg from './logo.svg';
// import 'antd/dist/antd.css';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logoSvg} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button>Delete</Button>
      </div>
    );
  }
}

export default App;
