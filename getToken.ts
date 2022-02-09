import * as axios from 'axios';
import inquirer from 'inquirer';
import XDGAppPaths from 'xdg-app-paths';
import { readFile } from 'fs/promises';
import { NIL } from 'uuid';
import dotenv from 'dotenv';

const IRE_AUTH_KEY = dotenv.config().parsed.IRE_AUTH_KEY;

interface Answers {
  mobileNumber: string;
  code: string;
  token: string;
}

async function main() {
  const answers = await inquirer.prompt<Answers>([
    {
      message: 'Mobile number',
      name: 'mobileNumber',
      type: 'string',
      async validate(mobile: string) {
        const res = await get('RequestCode', { mobile });
        if (res === false) {
          throw new Error('Invalid mobile');
        }
        return true;
      },
    },
    {
      message: 'Code',
      name: 'code',
      type: 'string',
      async validate(code: string, answers: Answers) {
        const userModel = await get<ValidateCodeResponse>('ValidateCode', {
          mobile: answers.mobileNumber,
          code: code,
        });

        let codeStatus: RequestCodeStatus;
        if (userModel.Mobile == 'MobileInUse')
          codeStatus = RequestCodeStatus.MobileInUse;
        else if (userModel.Mobile == 'PendingGroupMobile')
          codeStatus = RequestCodeStatus.PendingGroupMobile;
        else if (userModel.UserID == NIL) {
          codeStatus = RequestCodeStatus.InvalidCode;
        }
        if (codeStatus) {
          throw new Error(codeStatus.toString());
        }

        answers.token = userModel.Token;
        console.log(userModel);

        console.log('Token for', userModel.FirstName, 'is', userModel.Token);
        return true;
      },
    },
  ]);

  await setToken(answers.token);
}

enum RequestCodeStatus {
  MobileInUse,
  InvalidCode,
  PendingGroupMobile,
}

interface ValidateCodeResponse {
  ID: 0;
  UserID: '00000000-0000-0000-0000-000000000000';
  Token: '00000000-0000-0000-0000-000000000000';
  Authenticated: boolean;
  TokenExpiryUTC: '2022-02-05T10:01:50.4588742Z';
  DataExpiryUTC: '2022-02-05T10:01:50.4588742Z';
  FirstName: '';
  LastName: '';
  Mobile: 'MobileInUse';
  Email: '';
  ProfileImageURL: 'user_profile.png';
  ConfirmOnHideProperty: true;
  DevicePlatform: '';
  ConfirmOnHideTip: true;
  IdentityProviderType: 0;
  ProviderUserID: '';
  PushToken: '';
  AppEnabled: false;
  RatingActivated: 0;
  RatingResponse: 0;
  BuildNumber: 0;
  LastRatingActivatedUTC: '2000-01-01T00:00:00';
  TimeZone: '';
  LeaseID: 0;
  PropertyID: 0;
  ProspectID: 0;
  InspectionGUID: '00000000-0000-0000-0000-000000000000';
  Preferences: {
    Initialized: 0;
    ID: 0;
    MinBeds: 0;
    MaxBeds: 0;
    MinBaths: 0;
    MaxBaths: 0;
    MinCars: 0;
    MaxCars: 0;
    MinPrice: 0;
    MaxPrice: 0;
    MoveInBy: 0;
    MoveInWith: 0;
    MoveInDateUTC: '2000-01-01T00:00:00';
    MoveInDate: '2000-01-01T00:00:00+00:00';
    PropertySearchTypes: [];
    PropertyFeatureList: [];
    Suburbs: [];
    Status: 1;
    Keywords: null;
    EarlyBirdUnsubDateUTC: '2000-01-01T00:00:00';
    UploadError: false;
  };
  PreferencesJSON: null;
}

async function readJson<T>(filename: string): Promise<T> {
  return JSON.parse((await readFile(filename)).toString()) as T;
}

async function setToken(token: string) {
  const project = await readJson<{ projectId: string; orgId: string }>(
    '.vercel/project.json'
  );
  const key = 'TWO_APPLY_TOKEN';

  const configFilename =
    XDGAppPaths('com.vercel.cli').dataDirs()[0] + '/auth.json';

  const vercelToken = await readJson<{ token: string }>(configFilename);

  const ax = new axios.Axios({
    headers: {
      Authorization: 'Bearer ' + vercelToken,
    },
    baseURL: 'https://api.vercel.com/v7',
  });
  ax.interceptors.response.use((value) => {
    value.data = JSON.parse(value.data);
    return value;
  });

  const envs = (
    await ax.get<{ envs: { key: string; id: string }[] }>(
      `/projects/${project.projectId}/env`
    )
  ).data;

  const ident = envs.envs.find((env: { key: string }) => env.key == key)!.id;

  console.log(
    (
      await ax.patch(
        `/projects/${project.projectId}/env/${ident}`,
        JSON.stringify({
          target: ['production', 'preview', 'development'],
          value: token,
        })
      )
    ).data
  );
}

async function get<T>(route: string, params: any) {
  let res: axios.AxiosResponse<T, any>;
  try {
    res = await axios.default.get<T>(
      'https://inspectre-ta.azurewebsites.net/api/Account/' + route,
      {
        params,
        headers: {
          AuthKey: IRE_AUTH_KEY,
        },
      }
    );
  } catch (e) {
    if (axios.default.isAxiosError(e)) {
      console.log(e.response);
    }
    throw e;
  }
  return res.data;
}

main().then(() => process.exit());
