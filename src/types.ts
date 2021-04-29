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
}

export enum OnlineApplication {
  ONE_FORM = 'ONE_FORM',
  TWO_APPLY = 'TWO_APPLY',
  UNKNOWN = 'UNKNOWN',
}

export interface DataResponse {
  title: string;
  rows: Property[];
  statusMapping: { [key: string]: string };
}
