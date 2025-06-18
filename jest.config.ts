export default {
  transform: {
    '^.+\\.(t|j)s?$': ['@swc/jest'],
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test/unit/.*\\.spec\\.ts$', // <-- somente arquivos da pasta unit
  testEnvironment: 'node',
};
