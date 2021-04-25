import React from "react";
import "./App.css";
import useSWR from "swr";
import axios from "axios";
import { Button, Table, Tag, Section, Container, Form, Columns } from "react-bulma-components";
import { useTable, CellProps, useSortBy, Column, useGlobalFilter } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

interface Row {
  RealStatus: string;
  Address: string;
  Interested: string[];
  Link: string;
  Price: string;
  Beds: number;
}

function App() {
  const { data, isValidating, error } = useSWR(
    "/api/data",
    key => axios.get<{ rows: Row[] }>(key, { responseType: "json" })
  );
  const columns = React.useMemo(
    (): Column<Row>[] => [
      {
        Header: 'Status',
        accessor: (row: Row) => row.RealStatus,
      },
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
        Cell: ({ cell: { value } }: CellProps<Row, string[]>) => <span>{value.map(initials => <span key={initials}><Tag>{initials}</Tag>&nbsp;</span>)}</span>,
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
    setGlobalFilter,
    prepareRow
  } = useTable<Row>({ columns, data: data?.data.rows || [] }, useGlobalFilter, useSortBy);

  return (
    <Section>
      <Container breakpoint="fluid">
        <Columns>
          <Columns.Column>
            <Form.Field horizontal>
              <Form.Label>Search:&nbsp;</Form.Label>
              <Form.Field.Body>
                <Form.Input onChange={event => { setGlobalFilter(event.target.value); }} />
              </Form.Field.Body>
            </Form.Field>
          </Columns.Column>
          <Columns.Column>
            <Form.Field horizontal>
              <Button.Group>
                <Button disabled><span>Left</span></Button>
                <Button disabled><span>Middle</span></Button>
                <Button disabled><span>Right</span></Button>
              </Button.Group>
            </Form.Field>
          </Columns.Column>
          <Columns.Column>
            <div>
              {isValidating && "Loading..."}
              {error}
            </div>
          </Columns.Column>
        </Columns>
        <Table {...getTableProps()} style={{ width: 'inherit' }}>
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
              })}
          </tbody>
        </Table>
      </Container>
    </Section>
  );
}

export default App;
