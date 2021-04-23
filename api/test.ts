import { VercelRequest, VercelResponse } from "@vercel/node";
import { CellFormat, Color, GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.SHEET_ID!);
doc.useApiKey(process.env.GOOGLE_API_KEY!);

export default async (request: VercelRequest, response: VercelResponse) => {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const statusMapping: { [key: string]: string } = {};

  await sheet.loadCells(sheet.a1SheetName);

  const rows = (await sheet.getRows()).map(row => {
    const orow: any = {};

    let cell = sheet.getCell(row.rowIndex - 1, 0);
    if (cell.backgroundColor) {
      statusMapping[cell.backgroundColor.toString()] = sheet.headerValues[0];
    }

    for (const header of sheet.headerValues.slice(1)) {
      orow[header] = row[header];
    }

    return orow;
  });

  console.log('statusMapping', statusMapping);

  rows.forEach((row, idx) => {
    let cell = sheet.getCell(idx, 1);
    row.Status = statusMapping[cell.backgroundColor.toString()];
  });

  response.json({ title: doc.title, rows, statusMapping });
};
