import { VercelRequest, VercelResponse } from '@vercel/node';
import { uk } from 'chrono-node';
import { getProperties } from './data';
import { augment } from '../support';
import { compareAsc, endOfYesterday, startOfDay } from 'date-fns';
import _ from 'lodash';

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  response.json(await getData());
}

async function getData() {
  const { rows, statusMapping } = await getProperties();

  const yesterday = endOfYesterday();

  const today = rows
    .filter((prop) => prop['Viewed?'])
    .filter((prop) => prop['Viewed?']!.toLowerCase() !== 'requested')
    .map((prop) => ({
      prop,
      viewed: startOfDay(uk.parseDate(prop['Viewed?']!)),
    }))
    .filter(({ viewed }) => compareAsc(viewed, yesterday));

  await augment(today.map(({ prop }) => prop));

  return {
    today: _.sortBy(
      Object.entries(_.groupBy(today, (row) => row.viewed)),
      ([date]) => date
    ),
    statusMapping,
  };
}

export type ReturnShape = Awaited<ReturnType<typeof getData>>;
