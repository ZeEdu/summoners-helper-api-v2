import { createContext } from 'react';

export type PatchVersionType = {
  version: string;
};

export const PatchVersionContext = createContext<PatchVersionType | undefined>(
  undefined,
);