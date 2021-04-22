import { VercelRequest, VercelResponse } from "@vercel/node";

export default (request: VercelRequest, response: VercelResponse) => {
  response.json({
    body: request.body,
    query: request.query,
    cookies: request.cookies
  });
};
