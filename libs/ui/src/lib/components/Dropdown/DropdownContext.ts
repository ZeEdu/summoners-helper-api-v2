import { createContext, useContext } from 'react';

export interface DropdownContextValue {
  visible: boolean;
  openMenu(): void;
  closeMenu(): void;
  toggleMenu(): void;
}

export const DropdownContext =
  createContext<DropdownContextValue | null>(null);

export function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error(
      'Dropdown components must be rendered inside <Dropdown>.'
    );
  }

  return context;
}