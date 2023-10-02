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

export default function Inspections() {
  const { data, isValidating, error } = useSWR<ReturnShape>('/api/inspections');
  const days = data?.today || [];

  const [selectedDay, setSelectedDay] = useState(1);

  const [date, day] = days.length ? days[selectedDay - 1] : ['Loading', []];

  return (
    <Section>
      <Container breakpoint="fluid">
        <Heading>
          Find Rentals ({date})
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
                  <th>Inspector</th>
                </tr>
              </thead>
              <tbody>
                {day.map(({ prop }) => (
                  <tr key={prop.Address}>
                    <td> {prop.Address}</td>
                    <td>{prop['Viewed?']}</td>
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
