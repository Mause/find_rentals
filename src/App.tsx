import React, { useState } from 'react';
import './App.css';
import useSWR from 'swr';
import axios from 'axios';
import {
  Button,
  Table,
  Tag,
  Section,
  Container,
  Form,
  Columns,
  Heading,
  Loader,
  Modal,
  Card,
} from 'react-bulma-components';
import {
  useTable,
  CellProps,
  useSortBy,
  Column,
  useGlobalFilter,
  useFilters,
  Row,
  IdType,
} from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faExternalLinkAlt,
  faInfoCircle,
  faMap,
  faInfoCircle,
  faSquareFull,
} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { DataResponse, Property } from './types';

function PropertyInfo({ property }: { property: Property }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Modal show={show} onClose={() => setShow(false)}>
        <Modal.Card>
          <Modal.Card.Header>
            <Modal.Card.Title>{property.Address}</Modal.Card.Title>
          </Modal.Card.Header>
          <Card.Image
            alt="this is a placeholder"
            src="https://placekitten.com/400/300"
          />
          <Modal.Card.Body>
            <Columns>
              <Columns.Column>
                <Table striped>
                  <tbody>
                    <tr>
                      <th>Viewed</th>
                      <td>{property['Viewed?']}</td>
                      <th>Applied</th>
                      <td>{property['Applied?']}</td>
                    </tr>
                    <tr>
                      <th>Concerns</th>
                      <td>{property['Concerns']}</td>
                      <th>Good things</th>
                      <td>{property['Good things']}</td>
                    </tr>
                  </tbody>
                </Table>
              </Columns.Column>
            </Columns>
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
      <Button onClick={() => setShow(true)} color="ghost">
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>
    </>
  );
}

function App() {
  const { data, isValidating, error } = useSWR(
    '/api/data',
    (key) => axios.get<DataResponse>(key, { responseType: 'json' }),
    { refreshInterval: 0 }
  );
  const columns = React.useMemo(
    (): Column<Property>[] => [
      {
        id: 'status_color',
        accessor: (row: Property) => row.RealStatus,
        Cell: (row: CellProps<Property, string>) => {
          const style = data?.data.statusMapping[row.value];
          return style ? (
            <FontAwesomeIcon icon={faSquareFull} style={JSON.parse(style)} />
          ) : null;
        },
      },
      {
        Header: 'Status',
        accessor: (row: Property) => row.RealStatus,
      },
      {
        Header: 'Address',
        accessor: (row: Property) => row.Address,
        Cell: ({ cell: { value } }: CellProps<Property, string>) => (
          <span>
            {value}&nbsp;
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps?q=${value}`}
            >
              <FontAwesomeIcon icon={faMap} />
            </a>
          </span>
        ),
      },
      {
        Header: 'Price',
        accessor: (row: Property) => row.Price,
      },
      {
        Header: 'Beds',
        accessor: (row: Property) => row.Beds,
      },
      {
        Header: 'Interested',
        accessor: (row: Property) => row.Interested,
        Cell: ({ cell: { value } }: CellProps<Property, string[]>) => (
          <span>
            {value.map((initials) => (
              <span key={initials}>
                <Tag>{initials}</Tag>&nbsp;
              </span>
            ))}
          </span>
        ),
        filter: (
          rows: Array<Row<Property>>,
          columnIds: Array<IdType<Property>>,
          filterValue: string[]
        ) => {
          return rows.filter((row) =>
            filterValue.every((filterVal) =>
              row.values.Interested.includes(filterVal)
            )
          );
        },
      },
      {
        Header: 'Link',
        accessor: (row: Property) => row.Link,
        Cell: ({ cell: { value } }: CellProps<object>) => (
          <a rel="noreferrer" target="_blank" href={value}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        ),
      },
      {
        Header: 'More info',
        Cell: ({ row: { original } }: CellProps<Property>) => (
          <PropertyInfo property={original} />
        ),
      },
    ],
    [data?.data.statusMapping]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setFilter,
    setGlobalFilter,
    prepareRow,
  } = useTable<Property>(
    {
      columns,
      data: data?.data.rows || [],
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      autoResetSortBy: false,
    },
    useGlobalFilter,
    useFilters,
    useSortBy
  );

  const [selected, setSelected] = useState<string[]>([]);
  function addOrRemove(initial: string) {
    return () => {
      let s = _.clone(selected);

      if (selected.includes(initial)) {
        _.pull(s, initial);
      } else {
        s.push(initial);
      }

      setSelected(s);
      console.log(s);

      setFilter('Interested', s);
    };
  }

  const fact = (initial: string) => (
    <div key={initial}>
      <Form.Field horizontal>
        <Form.Field.Body>
          <Form.Checkbox
            checked={selected.includes(initial)}
            onClick={addOrRemove(initial)}
          >
            {initial}
          </Form.Checkbox>
        </Form.Field.Body>
      </Form.Field>
      &nbsp;
    </div>
  );

  return (
    <Section>
      <Heading>Find Rentals ({rows.length})</Heading>
      <Container breakpoint="fluid">
        <Columns>
          <Columns.Column>
            <Form.Field horizontal>
              <Form.Label>Search:&nbsp;</Form.Label>
              <Form.Field.Body>
                <Form.Input
                  onChange={(event) => {
                    setGlobalFilter(event.target.value);
                  }}
                />
              </Form.Field.Body>
            </Form.Field>
          </Columns.Column>
          <Columns.Column>
            <Form.Field horizontal>
              <Button.Group>
                {['EM', 'CM', 'EW', 'CHW'].map((initial) => fact(initial))}
                <div>
                  {isValidating && (
                    <Loader
                      style={{
                        width: 30,
                        height: 30,
                        border: '4px solid black',
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent',
                      }}
                    />
                  )}
                  {error?.toString()}
                </div>
              </Button.Group>
            </Form.Field>
          </Columns.Column>
        </Columns>
        <Table {...getTableProps()} style={{ width: 'inherit' }}>
          <thead>
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => (
                // Apply the header row props
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column) => (
                      // Apply the header cell props
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render('Header')}
                        <span>
                          {' '}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon icon={faArrowDown} />
                            ) : (
                              <FontAwesomeIcon icon={faArrowUp} />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()}>
                    {
                      // Loop over the rows cells
                      row.cells.map((cell) => {
                        // Apply the cell props
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
      </Container>
    </Section>
  );
}

export default App;
