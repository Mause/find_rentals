import { AxiosError } from 'axios';

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}

export function handleError<I, O>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(listingId: I) => Promise<O | undefined>>
): void {
  const method = descriptor.value!;

  descriptor.value = async function (listingId: I) {
    try {
      return method.call(target, listingId);
    } catch (e) {
      if (isAxiosError(e)) {
        switch (e.response?.status) {
          case 429:
          case 404:
            return undefined;
        }
      }
      throw e;
    }
  };
}
