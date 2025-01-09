module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  globalSetup: 'jest-preset-angular/global-setup',
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/app/$1",
    "@assets/(.*)": "<rootDir>/src/assets/$1",
    "@core/(.*)": "<rootDir>/src/app/core/$1",
    "@env": "<rootDir>/src/environments/environment",
    "@src/(.*)": "<rootDir>/src/src/$1",
    "@services/(.*)": "<rootDir>/src/app/core/services/$1",
    "@helpers/(.*)": "<rootDir>/src/app/helpers/$1",
    "@shared/(.*)": "<rootDir>/src/app/shared/$1",
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  coverageDirectory: "./coverage/app",
  coverageReporters: ["lcov", "text-summary", "cobertura", "html"],
  collectCoverageFrom: [
    "src/app/components/barcode-scanner/**/*.ts",         
    "src/app/guards/**/*.ts",                  
    "src/app/pages/credentials/**/*.ts",       
    "src/app/pages/settings/**/*.ts",          
    "src/app/pages/logs/**/*.ts",               
    "src/app/services/**/*.ts",
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/', 
    '<rootDir>/dist/',
    // '<rootDir>/src/app/pages/(?!credentials)',
  ],
  transformIgnorePatterns: ['/node_modules/(?!@stencil|stencil)/'],
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/dist/',
    // '/src/app/app.component',
    // '/src/app/components/',
    // '/src/app/guards/',
    // '/src/app/interceptors',
    // '/src/app/interfaces',
    // '/src/app/pages/',
    // '/src/app/services/(?!websocket)'
  ]
};
