export interface Property {
  RealStatus: string;
  Address: string;
  Interested: string[];
  Link: string;
  Price: string;
  Beds: number;
  "Good things": string;
  Concerns: string;
  "Viewed?": string;
  "Status?": string;
}

export interface DataResponse {
  title: string;
  rows: Property[];
  statusMapping: { [key: string]: string };
}
