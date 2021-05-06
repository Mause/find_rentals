export interface Property {
  RealStatus: string;
  Address: string;
  Interested: string[];
  Link: string;
  Price: string;
  Beds: number;
  'Good things': string;
  Concerns: string;
  'Viewed?': string;
  'Applied?': string;
  'Status?': string;
  system: OnlineApplication;
  applicationStatus: string;
  listing?: Listing;
}

export enum OnlineApplication {
  ONE_FORM = 'ONE_FORM',
  TWO_APPLY = 'TWO_APPLY',
  EMAIL = 'EMAIL',
  UNKNOWN = 'UNKNOWN',
}

export type StatusMapping = {
  [key: string]: string;
};

export interface DataResponse {
  rows: Property[];
  statusMapping: StatusMapping;
}

export interface Listing {
  agencyName: string;
  mainImage: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
}
