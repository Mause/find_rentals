import { VercelRequest, VercelResponse } from '@vercel/node';
import { uk } from 'chrono-node';
import { getProperties } from './data';
import { augment } from '../support';
import { startOfDay } from 'date-fns';
import _ from 'lodash';

export default async function (
  _request: VercelRequest,
  response: VercelResponse
) {
  response.json(await getData());
}

async function getData() {
  const { rows, statusMapping } = await getProperties();

  const today = rows
    .filter((prop) => prop['Viewed?'])
    .filter((prop) => prop['Viewed?']!.toLowerCase() !== 'requested')
    .map((prop) => {
      const viewed = prop['Viewed?']?.toLowerCase();
      const viewedParsed = parseDate(viewed);
      return {
        prop,
        viewed: viewedParsed,
        viewedDay: startOfDay(viewedParsed),
        viewer: inferViewer(viewed),
      };
    });

  await augment(today.map(({ prop }) => prop));

  return {
    today: _.sortBy(
      Object.entries(_.groupBy(today, (row) => row.viewedDay.toISOString())),
      ([date]) => date
    ),
    statusMapping,
  };
}

const config = uk.strict.clone();
config.refiners.push({
  refine(context, results) {
    for (const result of results) {
      result.start.assign('timezoneOffset', 8 * 60 * 60);
    }
    return results;
  },
});

function parseDate(viewed: string | undefined) {
  return config.parseDate(viewed!)!;
}

function inferViewer(viewed: string | undefined) {
  let viewer = undefined;
  if (viewed) {
    if (viewed.includes('elli')) {
      viewer = 'Elliana';
    } else if (viewed.includes('alex')) {
      viewer = 'Alex';
    } else if (viewed.includes('may')) {
      viewer = 'May';
    }
  }
  return viewer;
}

export type ReturnShape = Awaited<ReturnType<typeof getData>>;
