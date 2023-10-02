import useSWR from 'swr';
import * as types from './types';

export default function Inspections() {
  const { data, isValidating, error } = useSWR('/api/inspections');
  const today: types.Property[] = data?.today || [];

  return (
    <ul>
      {error ? <li>{error.toString()}</li> : undefined}
      <li> {isValidating ? 'Loading....' : 'Ready'}</li>
      {today.map((prop: any) => (
        <li key={prop.Address}>
          {prop.Address} ~ {prop['Viewed?']}
        </li>
      ))}
    </ul>
  );
}
