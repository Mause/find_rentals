import { VercelRequest, VercelResponse } from "@vercel/node";
import endpoint from "./data";

describe("data", () => {
  it("hello", async () => {
    const res = ({} as unknown) as VercelResponse;
    const spy = spyOn(res, "json");

    await endpoint(({} as unknown) as VercelRequest, res);

    expect(spy).toBeCalledWith({});
  });
});
