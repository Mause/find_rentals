import { VercelRequest, VercelResponse } from '@vercel/node';
import endpoint from '../api/data';

describe('data', () => {
  it.skip('hello', async () => {
    const res = ({} as unknown) as VercelResponse;
    const spy = jest.spyOn(res, 'json');

    await endpoint(({} as unknown) as VercelRequest, res);

    expect(spy).toBeCalledWith({});
  });
});
