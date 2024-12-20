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
    "src/app/services/camera-logs.service.ts",
    "src/app/services/toast.ts"
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/', 
    '<rootDir>/dist/',
    '<rootDir>/src/app/components/(?!barcode-scanner)',
    '<rootDir>/src/app/interceptors',
    '<rootDir>/src/app/interfaces',
    '<rootDir>/src/app/pages/(?!settings|logs|credentials)',
    '<rootDir>/src/app/services/(?!camera-logs|toast)'
  ],
  transformIgnorePatterns: ['/node_modules/(?!@stencil|stencil)/'],
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/dist/',
    '/src/app/components/(?!barcode-scanner)',
    '/src/app/interceptors',
    '/src/app/interfaces',
    '/src/app/pages/(?!settings|logs|credentials)',
    '/src/app/services/(?!camera-logs|toast)'
  ]
};
