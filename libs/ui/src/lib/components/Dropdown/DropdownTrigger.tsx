import { PropsWithChildren } from "react";
import { TouchableRipple } from "react-native-paper";
import { useDropdownContext } from "./DropdownContext";

export function DropdownTrigger({
  children,
}: PropsWithChildren) {
  const { toggleMenu } = useDropdownContext();

  return (
    <TouchableRipple
      onPress={toggleMenu}
    >
      {children}
    </TouchableRipple>
  );
}