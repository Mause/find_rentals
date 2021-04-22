import React from "react";
import logo from "./logo.svg";
import "./App.css";
import useSWR from "swr";
import axios from "axios";
import { Table } from "react-bulma-components";
import { useTable, CellProps } from "react-table";
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
        Header: "Address",
        accessor: row => row.Address
      },
      {
        Header: "Interested",
        accessor: row => row.Interested
      },
      {
        Header: "Link",
        accessor: row => row.Link,
        Cell: ({ cell: { value } }: CellProps<object>) => <a href={value}>∆</a>
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
          <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
            rows.map(row => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {// Loop over the rows cells
                  row.cells.map(cell => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}{" "}
          </tbody>
        </Table>
      </header>
    </div>
  );
}

export default App;
