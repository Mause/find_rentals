import useSWR from 'swr';

export default function Inspections() {
  const { data, isRevalidating, error } = useSWR('/api/inspections');
  const { today } = data;

  return (
    <ul>
      <li>{error.toString()}</li>
      {isRevalidating ? <li>Loading....</li> : undefined}
      {today.map((prop: any) => (
        <li key={prop.Address}>
          {prop.Address} ~ {prop['Viewed?']}
        </li>
      ))}
    </ul>
  );
}
