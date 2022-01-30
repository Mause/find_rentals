import axios from 'axios';
import inquirer from 'inquirer';
import { readFile } from 'fs/promises';
import { string } from 'prop-types';

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
      async validate(mobileNumber: string) {
        await get('RequestCode', { mobileNumber });
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
          { mobile: answers.mobileNumber, code: code }
        );
        answers.token = res.Token;
        console.log('Token for', res.FirstName, 'is', res.Token);
        return true;
      },
    },
  ]);

  await setToken(answers.token);
}

async function setToken(token: string) {
  const projectId = JSON.parse(
    (await readFile('.vercel/project.json')).toString()
  );
  const key = 'TWO_APPLY_TOKEN';

  const envs = (
    await axios.get<{ envs: { key: string; id: string }[] }>(
      `https://api.vercel.com/v7/projects/${projectId}/env`
    )
  ).data;

  const ident = envs.envs.find((env) => env.key == key).id;

  axios.patch(`https://api.vercel.com/v7/projects/{${projectId}/env/${ident}`, {
    headers: {
      Authorization: 'Bearer <TOKEN>',
      'Content-Type': 'application/json',
    },
    body: {
      target: ['production', 'preview', 'development'],
      value: token,
    },
  });
}

async function get<T>(route: string, params: any) {
  return (
    await axios.get<T>(
      'https://inspectre-ta.azurewebsites.net/api/Account/' + route,
      {
        params: params,
      }
    )
  ).data;
}

main().then(() => process.exit());
