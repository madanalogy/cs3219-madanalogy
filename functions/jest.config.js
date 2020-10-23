// jest.config.js
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./scripts/testSetup.ts'],
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['./src/**/*.js']
}
