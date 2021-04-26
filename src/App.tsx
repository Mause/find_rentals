import React from "react";
import "./App.css";
import useSWR from "swr";
import axios from "axios";
import { Button, Table, Tag, Section, Container, Form, Columns, Heading, Loader } from "react-bulma-components";
import { useTable, CellProps, useSortBy, Column, useGlobalFilter } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

interface Property {
  RealStatus: string;
  Address: string;
  Interested: string[];
  Link: string;
  Price: string;
  Beds: number;
  'Good things': string;
  Concerns: string,
  'Viewed?': string,
  'Status?': string
}

function App() {
  const { data, isValidating, error } = useSWR(
    "/api/data",
    key => axios.get<{ rows: Property[] }>(key, { responseType: "json" })
  );
  const columns = React.useMemo(
    (): Column<Property>[] => [
      {
        Header: 'Status',
        accessor: (row: Property) => row.RealStatus,
      },
      {
        Header: "Address",
        accessor: (row: Property) => row.Address
      },
      {
        Header: "Price",
        accessor: (row: Property) => row.Price
      },
      {
        Header: "Beds",
        accessor: (row: Property) => row.Beds
      },
      {
        Header: "Interested",
        accessor: (row: Property) => row.Interested,
        Cell: ({ cell: { value } }: CellProps<Property, string[]>) => <span>{value.map(initials => <span key={initials}><Tag>{initials}</Tag>&nbsp;</span>)}</span>,
      },
      {
        Header: "Link",
        accessor: (row: Property) => row.Link,
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
  } = useTable<Property>({ columns, data: data?.data.rows || [] }, useGlobalFilter, useSortBy);

  return (
    <Section>
      <Heading>Find Rentals</Heading>
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
                <div>
                  {isValidating && <Loader
                    style={{
                      width: 30,
                      height: 30,
                      border: '4px solid black',
                      borderTopColor: 'transparent',
                      borderRightColor: 'transparent',
                    }}
                  />}
                  {error}
                </div>
              </Button.Group>
            </Form.Field>
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
                          {' '}{column.isSorted
                            ? column.isSortedDesc
                              ? <FontAwesomeIcon icon={faArrowDown} />
                              : <FontAwesomeIcon icon={faArrowUp} />
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
