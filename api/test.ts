import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleSpreadsheet } from 'google-spreadsheets';

const doc = new GoogleSpreadsheet('....');
doc.useApiKey(process.env.GOOGLE_API_KEY);

export default (request: VercelRequest, response: VercelResponse) => {
  doc.loadInfo();
  response.json({
    body: doc.title,
    query: request.query,
    cookies: request.cookies
  });
};
