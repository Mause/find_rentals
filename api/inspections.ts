import { VercelRequest, VercelResponse } from '@vercel/node';
import { uk } from 'chrono-node';
import { getProperties } from './data';
import { augment } from '../support';

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  const { rows, statusMapping } = await getProperties();

  const today = rows
    .filter((prop) => prop['Viewed?'])
    .map((prop) => {
      const viewed = uk.parseDate(prop['Viewed?']!);
      return { ...prop, today: isToday(viewed) };
    })
    .filter(({ today }) => today);

  await augment(today);

  response.json({ today, statusMapping });
}

function isToday(date: Date): boolean {
  if (!date) {
    return false;
  }
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
}
