import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce commit types allowed in this project
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Formatting, missing semi colons, etc (no logic change)
        'refactor', // Code refactor (no feature, no bug fix)
        'perf',     // Performance improvement
        'test',     // Adding or fixing tests
        'chore',    // Build process, dependency updates
        'ci',       // CI/CD configuration changes
        'revert',   // Revert a previous commit
      ],
    ],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Type must not be empty
    'type-empty': [2, 'never'],
  },
};

export default config;
