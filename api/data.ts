import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleSpreadsheet, GoogleSpreadsheetCell } from "google-spreadsheet";
import _ from "lodash";
import { DataResponse, Property } from "../src/types";
import { assignApplicationStatus } from "./applicationSystems";

const doc = new GoogleSpreadsheet(process.env.SHEET_ID!);
doc.useApiKey(process.env.GOOGLE_API_KEY!);

export default async (request: VercelRequest, response: VercelResponse) => {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const statusMapping: { [key: string]: string } = {};

  await sheet.loadCells(sheet.a1SheetName);

  const rows: Partial<Property>[] = (await sheet.getRows()).map((row) => {
    const orow: Partial<Property> = {};

    let cell = sheet.getCell(row.rowIndex - 1, 0);
    if (getBackgroundColor(cell)) {
      statusMapping[getBackgroundColor(cell)!] = cell.value.toString();
    }

    for (const header of sheet.headerValues.slice(1)) {
      let value = row[header];

      if (header == "Beds") {
        value = parseInt(value);
      } else if (header == "Interested") {
        value = value
          ? value
              .split(", ")
              .map((initial: string) => initial.split(" ")[0])
              .filter((initial: string) => initial === initial.toUpperCase())
          : [];
      }

      orow[header] = value;
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
  });

  await assignApplicationStatus(rows);

  const res: DataResponse = {
    title: doc.title,
    rows: rows as Property[],
    statusMapping: _.invert(statusMapping),
  };

  response.json(res);
};

function getBackgroundColor(
  cell: GoogleSpreadsheetCell | undefined
): string | undefined {
  if (!cell?.userEnteredFormat) return undefined;

  const { textFormat, backgroundColor: bg } = cell.userEnteredFormat;

  let color = undefined;

  const format = (value: number) => Math.round((value || 0) * 256);
  if (bg) {
    color = `rgba(${format(bg.red)}, ${format(bg.green)}, ${format(bg.blue)}, ${
      100 - format(bg.alpha)
    })`;
  }

  return JSON.stringify({
    color,
    strikethrough: textFormat?.strikethrough || false,
  });
}
