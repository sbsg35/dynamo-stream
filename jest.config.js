/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@libs/(.*)$": "<rootDir>/src/libs/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
  },
  // setupFiles: ["dotenv.config"],
};
