import { ReactNode, useMemo, useState } from "react";

import { DropdownContext } from "./DropdownContext";

export interface DropdownProps {
  children: ReactNode;
}

export function Dropdown({
  children,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);

  const context = useMemo(() => ({
    visible,
    openMenu() {
      setVisible(true);
    },
    closeMenu() {
      setVisible(false);
    },
    toggleMenu() {
      setVisible(value => !value);
    },
  }), [visible]);

  return (
    <DropdownContext.Provider value={context}>
      {children}
    </DropdownContext.Provider>
  );
}