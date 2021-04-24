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
    console.log(
      "looking at cell",
      row.rowIndex - 1,
      0,
      getBackgroundColor(cell)
    );
    if (getBackgroundColor(cell)) {
      statusMapping[getBackgroundColor(cell)!] = sheet.headerValues[0];
    }

    for (const header of sheet.headerValues.slice(1)) {
      orow[header] = row[header];
    }

    return orow;
  });

  console.log("statusMapping", statusMapping);

  rows.forEach((row, idx) => {
    let cell = sheet.getCell(idx, 1);
    if (getBackgroundColor(cell)) {
      row.Status = statusMapping[getBackgroundColor(cell)!];
    }
  });

  response.json({ title: doc.title, rows, statusMapping });
};

function getBackgroundColor(
  cell: GoogleSpreadsheetCell | undefined
): string | undefined {
  try {
    return cell?.backgroundColor.toString();
  } catch (e) {
    return undefined;
  }
}
