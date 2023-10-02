import useSWR from 'swr';

export default function Inspections() {
  const { data } = useSWR('/api/inspections');

  return <div>`${data}`</div>;
}
