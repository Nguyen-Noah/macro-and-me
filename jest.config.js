module.exports = {
    testEnvironment: 'node',
  
    // Match only test files in the __test__ directory or other specified locations
    transform: {
      '^.+/__test__/.*\\.js$': 'babel-jest',  // Apply babel-jest to JS files in the __test__ folder
    },
  
    // Ignore transform for non-test files
    transformIgnorePatterns: [
      '/node_modules/',
    ],
  
  };
  