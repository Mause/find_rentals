import { AxiosRequestConfig } from 'axios';

declare module 'axios-vcr' {
  class RequestMiddleware {
    static failure(
      arg0:
        | ((
            value: AxiosRequestConfig
          ) => AxiosRequestConfig | Promise<AxiosRequestConfig>)
        | undefined,
      failure: any
    ) {
      throw new Error('Method not implemented.');
    }
    static success(
      cassettePath: string
    ):
      | ((
          value: AxiosRequestConfig
        ) => AxiosRequestConfig | Promise<AxiosRequestConfig>)
      | undefined {
      throw new Error('Method not implemented.');
    }
  }
  class ResponseMiddleware {
    static success(
      cassettePath: string
    ):
      | ((
          value: import('axios').AxiosResponse<any>
        ) =>
          | import('axios').AxiosResponse<any>
          | Promise<import('axios').AxiosResponse<any>>)
      | undefined {
      throw new Error('Method not implemented.');
    }
    static failure(arg0: any, failure: any) {
      throw new Error('Method not implemented.');
    }
  }
}
