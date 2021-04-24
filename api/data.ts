import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  CellFormat,
  Color,
  GoogleSpreadsheet,
  GoogleSpreadsheetCell,
} from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.SHEET_ID!);
doc.useApiKey(process.env.GOOGLE_API_KEY!);

export default async (request: VercelRequest, response: VercelResponse) => {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const statusMapping: { [key: string]: string } = {};

  await sheet.loadCells(sheet.a1SheetName);

  const rows = (await sheet.getRows()).map((row) => {
    const orow: any = {};

    let cell = sheet.getCell(row.rowIndex - 1, 0);
    if (getBackgroundColor(cell)) {
      statusMapping[getBackgroundColor(cell)!] = cell.value.toString();
    }

    for (const header of sheet.headerValues.slice(1)) {
      orow[header] = row[header];
    }

    return orow;
  });

  rows.forEach((row, idx) => {
    let cell = sheet.getCell(idx, 1);
    if (getBackgroundColor(cell)) {
      row.RealStatus = statusMapping[getBackgroundColor(cell)!];
    }
    row.Interested = row.Interested.split(", ").map(
      (initial: string) => initial.split(" ")[0]
    );
  });

  response.json({ title: doc.title, rows });
};

function getBackgroundColor(
  cell: GoogleSpreadsheetCell | undefined
): string | undefined {
  let bg;
  try {
    bg = cell?.backgroundColor;
  } catch (e) {
    return undefined;
  }

  if (!bg) return undefined;

  return `${bg.red}${bg.green}${bg.blue}${bg.alpha}`;
}
