import { VercelRequest, VercelResponse } from '@vercel/node';
import endpoint from '../api/data';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import { Polly } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';
import RESTPersister from '@pollyjs/persister-rest';

Polly.register(XHRAdapter);
Polly.register(RESTPersister);

dotenv.config();

let polly: Polly;

beforeEach(() => {
  polly = new Polly('Data Test', {
    adapters: ['xhr'],
    persister: 'rest',
  });
  polly.record();
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

    jest.setTimeout(500000);
    await endpoint(({} as unknown) as VercelRequest, res);

    expect(json.mock.calls[0][0]).toMatchSnapshot();
  });
});
