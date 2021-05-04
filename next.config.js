new SentryWebpackPlugin({
  include: '.next',
  ignore: ['node_modules'],
  urlPrefix: '~/_next',
  release: process.env.VERCEL_GIT_COMMIT_SHA,
});
