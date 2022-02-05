import * as axios from 'axios';
import inquirer from 'inquirer';
import XDGAppPaths from 'xdg-app-paths';
import { readFile } from 'fs/promises';
import { AxiosResponseHeaders } from 'axios';

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
        const res = await get<{ Token: string; FirstName: string }>(
          'ValidateCode',
          { mobile: answers.mobileNumber, code: code, checkExisting: true }
        );
        answers.token = res.Token;
        console.log('Token for', res.FirstName, 'is', res.Token);
        return true;
      },
    },
  ]);

  await setToken(answers.token);
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
      { params }
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
