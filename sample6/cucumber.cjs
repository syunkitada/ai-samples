module.exports = {
  default: {
    require: [],
    import: [
      'tests/e2e/support/**/*.ts',
      'tests/e2e/steps/**/*.ts'
    ],
    requireModule: ['ts-node/register/transpile-only'],
    loader: ['ts-node/esm'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    paths: ['spec/features/**/*.feature']
  }
};
