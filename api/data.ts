import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  Color,
  GoogleSpreadsheet,
  GoogleSpreadsheetCell,
} from "google-spreadsheet";
import _ from "lodash";

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
    const cell = sheet.getCell(idx + 1, 1);
    const colour = getBackgroundColor(cell);
    if (colour) {
      row.RealStatus = statusMapping[colour!];
      if (typeof row.RealStatus === "undefined") {
        console.warn("unable to lookup color: ", colour);
      }
    }
    row.Beds = parseInt(row.Beds);
    row.Interested = row.Interested
      ? row.Interested.split(", ")
          .map((initial: string) => initial.split(" ")[0])
          .filter((initial: string) => initial === initial.toUpperCase())
      : [];
  });

  Object.assign(statusMapping, _.invert(statusMapping));

  response.json({ title: doc.title, rows, statusMapping });
};

function getBackgroundColor(
  cell: GoogleSpreadsheetCell | undefined
): string | undefined {
  let bg: Color;
  try {
    bg = cell?.backgroundColor;
  } catch (e) {
    return undefined;
  }

  if (!bg) return undefined;

  const format = (value: number) => Math.round((value || 0) * 256);

  return `rgba(${format(bg.red)}, ${format(bg.green)}, ${format(bg.blue)}, ${
    100 - format(bg.alpha)
  })`;
}
