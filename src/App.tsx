import React from "react";
import logo from "./logo.svg";
import "./App.css";
import useSWR from "swr";
import axios from "axios";
import { Table } from "react-bulma-components";

function App() {
  const { data } = useSWR("https://mause-housing.builtwithdark.com/", key =>
    axios.get<
      {
        Address: string;
        Interested: string[];
        Link: string;
      }[]
    >(key, { responseType: "json" })
  );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Interested</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map(row => (
              <tr key={row.Address}>
                <td>{row.Address}</td>
                <td>{row.Interested.join(", ")}</td>
                <td><a target="_blank" href={row.Link}>∆</a></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </header>
    </div>
  );
}

export default App;
