import { useContext } from "react";
import { MenuItemProps } from "react-native-paper";

import DropdownContext from './DropdownContext';
import DropdownCustomMenuItem from './DropdownCustomMenuItem';

export interface Props extends Omit<MenuItemProps, 'onPress'> {
  value: string
}

const DropdownItem = (props: Props) => {
  const dropdownContext = useContext(DropdownContext)

  return (
    <DropdownCustomMenuItem
      title={props.title}
      onPress={() => dropdownContext.onChange?.(props.value)}
    ></DropdownCustomMenuItem>
  )
}

export default DropdownItem