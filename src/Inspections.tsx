import useSWR from 'swr';

export default function Inspections() {
  const { data } = useSWR('/api/inspections');
  if (!data) return <div>Loading....</div>;
  const { today } = data;

  return (
    <ul>
      {today.map((prop) => (
        <li key={prop.Address}>
          {prop.Address} ~ {prop['Viewed?']}
        </li>
      ))}
    </ul>
  );
}
