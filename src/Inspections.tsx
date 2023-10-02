import useSWR from 'swr';
import * as types from './types';
import { ReturnShape } from '../api/inspections';
import { useState } from 'react';
import { Button, Pagination } from 'react-bulma-components';

export default function Inspections() {
  const { data, isValidating, error } = useSWR<ReturnShape>('/api/inspections');
  const days = Object.entries(data?.today || {});

  const [selectedDay, setSelectedDay] = useState(0);

  const [date, day] = days[selectedDay];

  return (
    <>
      <h3>{date}</h3>
      <Pagination
        current={selectedDay}
        total={days.length}
        onChange={setSelectedDay}
      />
      <ul>
        {error ? <li>{error.toString()}</li> : undefined}
        <li> {isValidating ? 'Loading....' : 'Ready'}</li>
        {day.map((prop: any) => (
          <li key={prop.Address}>
            {prop.Address} ~ {prop['Viewed?']}
          </li>
        ))}
      </ul>
    </>
  );
}
