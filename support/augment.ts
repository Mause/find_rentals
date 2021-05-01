import _ from 'lodash';
import { URL } from 'url';
import { Listing, Property } from '../src/types';

import * as domainComAu from './domain.com.au';
import * as realEstateComAu from './realestate.com.au';
import { assignApplicationStatus } from './applicationSystems';

type Augmenter = (row: Partial<Property>) => Promise<void>;
export interface ListingRetriever {
  getListing(listingId: string): Promise<Listing | undefined>;
}

const augmenters: Augmenter[] = [assignApplicationStatus, assignListingInfo];

async function assignListingInfo(property: Partial<Property>) {
  if (property.Link) {
    const link = new URL(property.Link);
    const listingId = _.last(link.pathname.split('-'))!;

    if (link.hostname.includes('realestate.com.au')) {
      property.listing = await realEstateComAu.getListing(listingId);
    } else if (link.hostname.includes('domain.com')) {
      property.listing = await domainComAu.getListing(listingId);
    }
  }
}

export async function augment(rows: Partial<Property>[]) {
  await Promise.all(
    _.flatten(rows.map((row) => augmenters.map((augmenter) => augmenter(row))))
  );
}
