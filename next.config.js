//Get the commit sha from either Github, Gitlab, or Bitbucket
const COMMIT_SHA =
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA;

new SentryWebpackPlugin({
  include: '.next',
  ignore: ['node_modules'],
  urlPrefix: '~/_next',
  release: COMMIT_SHA,
});
