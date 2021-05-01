import axios, { AxiosError } from 'axios';
import { Agent } from 'node:http';
import { Listing } from '../../src/types';

async function search() {
  const res = await axios.get(
    'https://services.realestate.com.au/services/listings/search',
    {
      params: {
        query: {
          channel: 'buy',
          filters: {
            replaceProjectWithFirstChild: true,
            propertyTypes: ['house'],
            ',<priceRange': { minimum: 0 },
          },
          localities: [{ subdivision: 'NSW', postcode: '2287' }],
        },
      },
    }
  );

  return res.data;
}

export interface Image {
  server: string;
  uri: string;
}

interface REAListing {
  agency: {
    name: string;
  };
  mainImage: Image;
  images: Image[];
  generalFeatures: {
    bedrooms: {
      value: number;
    };
    bathrooms: {
      value: number;
    };
    parkingSpaces: {
      value: number;
    };
  };
}

export async function getListing(
  listingId: string
): Promise<Listing | undefined> {
  return await axios
    .get<REAListing>(
      `https://services.realestate.com.au/services/listings/${listingId}`
    )
    .then((t) => t.data)
    .then((res) => {
      let image = res?.mainImage || res?.images[0];
      let mainImage: string | undefined;
      if (image) {
        mainImage = `${image.server}/800x600-format=webp${image.uri}`;
      }

      const { agency, generalFeatures } = res;
      return {
        agencyName: agency.name,
        mainImage: mainImage!,
        bedrooms: generalFeatures.bedrooms.value,
        bathrooms: generalFeatures.bathrooms.value,
        parkingSpaces: generalFeatures.parkingSpaces?.value || -1,
      };
    })
    .catch((error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      } else {
        throw error;
      }
    });
}

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}
