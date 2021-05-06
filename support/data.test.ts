import { VercelRequest, VercelResponse } from '@vercel/node';
import endpoint from '../api/data';
import dotenv from 'dotenv';
import { Polly } from '@pollyjs/core';
import NodeHTTPAdapter from '@pollyjs/adapter-node-http';
import FSPersister from '@pollyjs/persister-fs';

Polly.register(NodeHTTPAdapter);
Polly.register(FSPersister);

dotenv.config();

let polly: Polly;

beforeEach(() => {
  polly = new Polly('Data Test', {
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: '__recordings__',
      },
    },
  });
});
afterEach(async () => {
  await polly.stop();
});

describe('data', () => {
  it('hello', async () => {
    const json = jest.fn(
      (body: any): VercelResponse => {
        return res;
      }
    );
    const res = ({ json } as unknown) as VercelResponse;

    await endpoint(({} as unknown) as VercelRequest, res);

    expect(json.mock.calls[0][0]).toMatchSnapshot();
  });
});
