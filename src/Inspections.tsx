import useSWR from 'swr';
import { ReturnShape } from '../api/inspections';
import { useState } from 'react';
import {
  Columns,
  Container,
  Heading,
  Pagination,
  Section,
} from 'react-bulma-components';

export default function Inspections() {
  const { data, isValidating, error } = useSWR<ReturnShape>('/api/inspections');
  const days = data?.today || [];

  const [selectedDay, setSelectedDay] = useState(0);

  const [date, day] = days.length ? days[selectedDay] : ['Loading', []];

  return (
    <Section>
      <Container breakpoint="fluid">
        <Heading>Find Rentals ({date})</Heading>
        <Columns>
          <Columns.Column>
            <Pagination
              current={selectedDay}
              total={days.length}
              onChange={setSelectedDay}
            />
            <ul>
              {error ? <li>{error.toString()}</li> : undefined}
              <li> {isValidating ? 'Loading....' : 'Ready'}</li>
              {day.map(({ prop }) => (
                <li key={prop.Address}>
                  {prop.Address} ~ {prop['Viewed?']}
                </li>
              ))}
            </ul>
          </Columns.Column>
        </Columns>
      </Container>
    </Section>
  );
}
