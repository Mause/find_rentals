declare module "@vercel/node" {
  class VercelRequest {}
  class VercelResponse {
    json(response) {}
  }
}
