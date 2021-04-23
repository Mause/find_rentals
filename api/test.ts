import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
doc.useApiKey(process.env.GOOGLE_API_KEY);

export default async (request: VercelRequest, response: VercelResponse) => {
  await doc.loadInfo();
  response.json({
    body: doc.title,
    query: request.query,
    cookies: request.cookies
  });
};
