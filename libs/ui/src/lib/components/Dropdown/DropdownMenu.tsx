import { PropsWithChildren } from "react";
import { Menu } from "react-native-paper";
import { useDropdownContext } from "./Dropdown.context";

export function DropdownMenu({
  children,
}: PropsWithChildren) {
  const { visible, closeMenu } = useDropdownContext();

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={undefined}
    >
      {children}
    </Menu>
  );
}