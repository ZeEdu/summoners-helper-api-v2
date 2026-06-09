import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

process.env.NODE_ENV = 'test'

export default async (): Promise<Config> => ({
  projects: await getJestProjectsAsync(),
});
