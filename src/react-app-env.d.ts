/// <reference types="react-scripts" />

import { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'axios-vcr' {
  class RequestMiddleware {
    static failure(
      arg0:
        | ((
            value: AxiosRequestConfig
          ) => AxiosRequestConfig | Promise<AxiosRequestConfig>)
        | undefined,
      failure: any
    ) {}
    static success(
      cassettePath: string
    ):
      | ((
          value: AxiosRequestConfig
        ) => AxiosRequestConfig | Promise<AxiosRequestConfig>)
      | undefined {}
  }
  class ResponseMiddleware {
    static success(
      cassettePath: string
    ):
      | ((
          value: AxiosResponse<any>
        ) => AxiosResponse<any> | Promise<AxiosResponse<any>>)
      | undefined {}
    static failure(arg0: any, failure: any) {}
  }
}
