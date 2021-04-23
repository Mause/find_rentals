import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.SHEET_ID!);
doc.useApiKey(process.env.GOOGLE_API_KEY!);

export default async (request: VercelRequest, response: VercelResponse) => {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = (await sheet.getRows()).map(row => {
    const orow = {};
    for (const header of sheet.headerValues.slice(1)) {
      orow[header] = row[name];
    }
    return orow;
  });
  response.json({ title: doc.title, rows });
};
