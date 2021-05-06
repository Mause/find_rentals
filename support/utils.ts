import { AxiosError } from 'axios';
import { CollectionReference, Firestore } from '@google-cloud/firestore';
import { logger } from './logger';

type Toop<I, O> = TypedPropertyDescriptor<
  (listingId: I) => Promise<O | undefined>
>;

// Load the service account key JSON file.
const keyFilename = 'find-rentals-c060658e2390.json';
const serviceAccount = process.env.GCLOUD_CREDENTIALS
  ? JSON.parse(Buffer.from(process.env.GCLOUD_CREDENTIALS, 'base64').toString())
  : undefined;
const datastore = new Firestore({
  credentials: serviceAccount,
  projectId: serviceAccount?.project_id,
  keyFilename: serviceAccount ? undefined : keyFilename,
});

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}

export function cached<I, O>(collectionName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: Toop<I, O>
  ): void {
    const method = descriptor.value!;
    const collection = datastore.collection(
      collectionName
    ) as CollectionReference<O>;

    descriptor.value = async function (listingId: I): Promise<O | undefined> {
      const doc = collection.doc(
        [propertyKey, 'listingId', listingId].join('/')
      );

      let data = (await doc.get()).data();

      if (data) {
        logger.info('cache hit');
      } else {
        logger.warn('cache miss', { listingId });
        data = await method.call(this, listingId);
        if (data) {
          await doc.set(data);
        }
      }

      return data;
    };
  };
}

export function handleError<I, O>(
  target: any,
  propertyKey: string,
  descriptor: Toop<I, O>
): void {
  const method = descriptor.value!;

  descriptor.value = async function (listingId: I) {
    try {
      return await method.call(target, listingId);
    } catch (e) {
      if (isAxiosError(e)) {
        switch (e.response?.status) {
          case 429:
          case 404:
            logger.warn('call failed', {
              listingId,
              status: e.response.status,
              data: e.response.data,
            });
            return undefined;
        }
      }
      throw e;
    }
  };
}
