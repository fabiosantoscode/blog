const tapReporter = process.env.CI
  ? {
      reporters: [
        [
          'jest-tap-reporter',
          {
            logLevel: 'ERROR',
            showInternalStackTraces: true
            //filePath: "filename.tap"
          }
        ]
      ]
    }
  : {};

module.exports = {
  testPathIgnorePatterns: ['.cache'],
  ...tapReporter
};
