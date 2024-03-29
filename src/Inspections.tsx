import useSWR from 'swr';
import { ReturnShape } from '../api/inspections';
import { useState } from 'react';
import {
  Columns,
  Container,
  Heading,
  Loader,
  Pagination,
  Section,
  Table,
} from 'react-bulma-components';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { AddressBlock } from './App';

export default function Inspections() {
  const { data, isValidating, error } = useSWR<ReturnShape>('/api/inspections');
  const days = data?.today || [];

  const [selectedDay, setSelectedDay] = useState(1);

  const [date, day] = days.length ? days[selectedDay - 1] : ['Loading', []];

  return (
    <Section>
      <Container breakpoint="fluid">
        <Heading>
          Find Rentals ({date.split('T')[0]})
          <div>
            {isValidating ? (
              <Loader
                style={{
                  width: 30,
                  height: 30,
                  border: '4px solid black',
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                }}
              />
            ) : undefined}
            {error?.toString()}
          </div>
        </Heading>
        <Columns>
          <Columns.Column>
            <Pagination
              current={selectedDay}
              total={days.length}
              onChange={setSelectedDay}
            />
            <Table
              size="fullwidth"
              striped
              style={{
                overflowX: 'scroll',
                whiteSpace: 'nowrap',
              }}
            >
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Viewer</th>
                  <th>View time</th>
                </tr>
              </thead>
              <tbody>
                {day.map(({ prop, viewer, viewed }) => (
                  <tr key={prop.Address}>
                    <td>
                      <AddressBlock value={prop.Address!} />
                    </td>
                    <td>{viewer}</td>
                    <td>
                      {format(
                        parseISO(viewed as unknown as string),
                        'hh:mmaaaa'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Columns.Column>
        </Columns>
      </Container>
    </Section>
  );
}
