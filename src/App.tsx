import React from "react";
import logo from "./logo.svg";
import "./App.css";
import useSWR from "swr";
import axios from "axios";
import { Table } from 'react-bulma-components';

function App() {
  const { data } = useSWR("https://mause-housing.builtwithdark.com/", key =>
    axios.get<
      {
        Address: string;
      }[]
    >(key, { responseType: "json" })
  );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Table>
          <tbody>
            {data?.data.map(row => (
              <tr key={row.Address}>
                <td>{row.Address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </header>
    </div>
  );
}

export default App;
