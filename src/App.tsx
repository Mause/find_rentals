import React from 'react';
import logo from './logo.svg';
import './App.css';
import useSWR from 'swr';
import axios from 'axios';

function App() {
  const { data } = useSWR('https://mause-housing.builtwithdark.com/', key => axios.get(key, {responseType: 'json'}));
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Properties: { data?.data.length }
        </p>
      </header>
    </div>
  );
}

export default App;
