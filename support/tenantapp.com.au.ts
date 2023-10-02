import { URL } from 'url';
import { Listing } from '../src/types';
import axios from 'axios';
import { load } from 'cheerio';
import { logger } from './logger';

export async function getListing(link: URL): Promise<Listing | undefined> {
  const res = await axios.get(link.href);

  const $ = load(res.data);
  const image = $('img.carousel-image').attr('src');
  const description = $('meta[name="description"]').attr('content');

  const match =
    /A (?<rooms>\d+) (?<descr>.*) for rent in (.*)\. With (?<bathrooms>.*) bathroom & (?<garage>.*) garage. View (?<address>.*) rental details now(. Listed by (?<realter>.*) of (?<agency>.*) & TenantApp.com.au)?/g.exec(
      description!
    );
  if (!match) {
    logger.info('no match', description);
    return undefined;
  }

  const { groups } = match;
  if (!groups) {
    return undefined;
  }

  return {
    mainImage: image!,
    agencyName: groups.agency,
    bathrooms: parseInt(groups.bathrooms),
    bedrooms: parseInt(groups.rooms),
    parkingSpaces: parseInt(groups.garage),
  };
}
