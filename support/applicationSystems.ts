import axios from 'axios';
import _ from 'lodash';
import { logger } from './logger';
import { OnlineApplication, Property } from '../src/types';

const TWO_APPLY_TOKEN = process.env.TWO_APPLY_TOKEN;
const ONE_FORM_COOKIE = process.env.ONE_FORM_COOKIE;

export async function assignApplicationStatus(row: Partial<Property>) {
  let oneForm: Record<string, string> = {};
  // try {
  //   oneForm = await getOneForm();
  // } catch (e) {
  //   logger.error('Unable to retrieve 1form', e);
  // }
  const twoApply = await getTwoApply();

  const applied = row['Applied?'];
  if (!applied) return;

  if (applied.toLowerCase().indexOf('1form') > -1) {
    row.system = OnlineApplication.ONE_FORM;
  } else if (applied.toLowerCase().indexOf('2apply') > -1) {
    row.system = OnlineApplication.TWO_APPLY;
  } else if (applied.toLowerCase().indexOf('email') > -1) {
    row.system = OnlineApplication.EMAIL;
  } else {
    row.system = OnlineApplication.UNKNOWN;
  }

  if (
    row.system === OnlineApplication.ONE_FORM ||
    row.system === OnlineApplication.TWO_APPLY
  ) {
    const source =
      row.system === OnlineApplication.ONE_FORM ? oneForm : twoApply;

    row.applicationStatus = source[row.Address!.toLowerCase()];
    if (row.applicationStatus) {
      logger.info('matched:', {
        address: row.Address,
        system: row.system,
        applicationStatus: row.applicationStatus,
      });
    } else {
      logger.info('could not locate %s in %s', row.Address, source);
    }
  }

  if (!row.applicationStatus) {
    row.applicationStatus = 'unknown';
  }
}

interface OneForm {
  address: string[];
  status: string;
}

interface OneFormResponse {
  complete: OneForm[];
}

async function getOneForm(): Promise<{ [key: string]: string }> {
  const res = await axios.get<OneFormResponse>(
    'https://www.1form.com/ras-api/dashboard',
    {
      headers: {
        cookie: ONE_FORM_COOKIE!,
      },
    }
  );

  if (res.status !== 200) {
    logger.error('error calling 1form', {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    });
  }

  return _.fromPairs(
    res.data.complete.map((form) => [
      form.address[0].toLowerCase(),
      form.status,
    ])
  );
}

enum AppStatusGroup {
  Received = 1,
  Processing = 2,
  Paid = 3,
  Unsuccessful = 4,
  Withdrawn = 5,
}

interface TwoApplyResponse {
  AppDetail: {
    StatusGroup: AppStatusGroup;
  };
  PropDetail: {
    Address: string;
  };
}

async function getTwoApply(): Promise<{ [key: string]: string }> {
  const res = await axios.get<TwoApplyResponse[]>(
    'https://inspectre-ta.azurewebsites.net/api/Application',
    {
      headers: {
        Token: TWO_APPLY_TOKEN!,
        BuildNumber: 1,
      },
    }
  );

  if (res.status != 200) {
    logger.error('error calling 2apply', {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    });
  } else if (res.data == null) {
    logger.error('2apply token has expired');
  }

  return _.fromPairs(
    (res.data || []).map((application) => [
      application.PropDetail.Address.toLowerCase(),
      AppStatusGroup[application.AppDetail.StatusGroup],
    ])
  );
}
