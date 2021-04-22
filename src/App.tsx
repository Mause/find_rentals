import React from "react";
import logo from "./logo.svg";
import "./App.css";
import useSWR from "swr";
import axios from "axios";
import { Table } from "react-bulma-components";
import { useTable } from "react-table";
interface Row {
  Address: string;
  Interested: string[];
  Link: string;
}
function App() {
  const { data } = useSWR("https://mause-housing.builtwithdark.com/", key =>
    axios.get<Row[]>(key, { responseType: "json" })
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "Address"
      },
      {
        Header: "Interested"
      },
      {
        Header: "Link"
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable<Row>({ columns, data: data?.data || [] });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Table {...getTableProps()}>
          <thead>
            {// Loop over the header rows
            headerGroups.map(headerGroup => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {// Loop over the headers in each row
                headerGroup.headers.map(column => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {// Render the header
                    column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data?.data.map(row => (
              <tr key={row.Address}>
                <td>{row.Address}</td>
                <td>{row.Interested.join(", ")}</td>
                <td>
                  <a rel="noreferrer" target="_blank" href={row.Link}>
                    ∆
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </header>
    </div>
  );
}

export default App;
