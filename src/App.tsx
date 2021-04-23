import React from "react";
import "./App.css";
import useSWR from "swr";
import axios from "axios";
import { Table, Tag, Columns, Section, Container } from "react-bulma-components";
import { useTable, CellProps, useSortBy } from "react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

interface Row {
  Address: string;
  Interested: string[];
  Link: string;
  Price: string;
  Beds: number;
}

function App() {
  const { data, isValidating, error } = useSWR(
    "https://mause-housing.builtwithdark.com/",
    key => axios.get<Row[]>(key, { responseType: "json" })
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "Address",
        accessor: (row: Row) => row.Address
      },
      {
        Header: "Price",
        accessor: (row: Row) => row.Price
      },
      {
        Header: "Beds",
        accessor: (row: Row) => row.Beds
      },
      {
        Header: "Interested",
        accessor: (row: Row) => row.Interested,
        Cell: ({ cell: { value } }: CellProps<Row, string[]>) => <span>{value.map(initials => <span><Tag key={initials}>{initials.split(' ')[0]}</Tag>&nbsp;</span>)}</span>,
      },
      {
        Header: "Link",
        accessor: (row: Row) => row.Link,
        Cell: ({ cell: { value } }: CellProps<object>) => (
          <a rel="noreferrer" target="_blank" href={value}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        )
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
  } = useTable<Row>({ columns, data: data?.data || [] }, useSortBy);

  return (
    <Section>
      <Container fluid>
        <p>
          {isValidating && "Loading..."}
          {error}
        </p>
        <Table {...getTableProps()}>
          <thead>
            {// Loop over the header rows
              headerGroups.map(headerGroup => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                      // Apply the header cell props
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
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
      </Container>
    </Section>
  );
}

export default App;
