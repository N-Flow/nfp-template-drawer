import { type Config } from 'rhine-lint';

export default {
  // Project level: 'normal' | 'react' | 'next'
  level: 'react',

  // Enable TypeScript support
  typescript: true,

  // Enable project-based type checking
  projectTypeCheck: true,

  // Additional ignore patterns
  ignores: [],

  // ESLint specific configuration
  eslint: {
    enable: true,
    config: [
      // Add custom ESLint rules here
      // {
      //   rules: {
      //     'no-console': 'warn',
      //   }
      // }
    ]
  },

  // Prettier specific configuration
  prettier: {
    enable: true,
    config: {
      // Add custom Prettier options here
      // printWidth: 100,
      // semi: true,
    }
  }
} as Config;