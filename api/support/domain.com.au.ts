import axios from 'axios';
import { Listing } from '../../src/types';

interface DomainListing {
  advertiserIdentifiers: {
    advertiserId: number;
  };
  bathrooms: number;
  bedrooms: number;
  carspaces: number;
  media: [
    {
      url: string;
    }
  ];
}

export async function getListing(listingId: string): Promise<Listing> {
  const {
    bedrooms,
    advertiserIdentifiers,
    media,
    bathrooms,
    carspaces,
  } = await get<DomainListing>(`listings/${listingId}`);

  const agencyName = (
    await get<{ name: string }>(
      'agencies/' + advertiserIdentifiers.advertiserId
    )
  ).name;

  return {
    bedrooms,
    bathrooms,
    parkingSpaces: carspaces,
    mainImage: media[0].url,
    agencyName,
  };
}

async function get<T>(fragment: string): Promise<T> {
  const t = await axios.get<T>(`https://api.domain.com.au/v1/${fragment}`, {
    headers: {
      accept: 'application/json',
      'X-Api-Key': process.env.DOMAIN_API_KEY,
    },
  });
  return t.data;
}
