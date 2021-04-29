import { VercelRequest, VercelResponse } from '@vercel/node';
import endpoint from '../api/data';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequestMiddleware, ResponseMiddleware } from 'axios-vcr';
import dotenv from 'dotenv';

dotenv.config();

let cassettes: {
  [key: string]: {
    axios: AxiosInstance;
    responseInterceptor: number;
    requestInterceptor: number;
  };
} = {};

function mountCassette(axios: AxiosInstance, cassettePath: string) {
  let responseInterceptor = axios.interceptors.response.use(
    ResponseMiddleware.success(cassettePath),
    ResponseMiddleware.failure
  );

  let requestInterceptor = axios.interceptors.request.use(
    RequestMiddleware.success(cassettePath),
    RequestMiddleware.failure
  );

  cassettes[cassettePath] = {
    responseInterceptor: responseInterceptor,
    requestInterceptor: requestInterceptor,
    axios: axios,
  };
}

function ejectCassette(cassettePath: string) {
  let interceptors = cassettes[cassettePath];
  let axios = interceptors.axios;

  axios.interceptors.response.eject(interceptors.responseInterceptor);
  axios.interceptors.request.eject(interceptors.requestInterceptor);
}

const CASSETTE = 'cassette.json';

// beforeEach(() => {
//   const original = axios.create;
//   axios.create = function (config?: AxiosRequestConfig) {
//     const instance = original.call(null, config);
//     mountCassette(instance, CASSETTE);
//     return instance;
//   };
// });
// afterEach(() => {
//   ejectCassette(CASSETTE);
// });

describe('data', () => {
  it('hello', async (done) => {
    const res = ({
      json: jest.fn(),
    } as unknown) as VercelResponse;

    await endpoint(({} as unknown) as VercelRequest, res);

    expect(res.json).toMatchSnapshot();
  });
});
