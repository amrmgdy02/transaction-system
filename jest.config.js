module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s',
    '**/?(*.)+(spec|test).[jt]s',
  ],
  moduleFileExtensions: ['js', 'json'],
};
