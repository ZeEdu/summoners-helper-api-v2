import { useContext } from "react";
import { Menu, MenuItemProps } from "react-native-paper";
import DropdownContext from './DropdownContext';

export interface Props extends Omit<MenuItemProps, 'onPress'> {
  value: string
}

const DropdownItem = (props: Props) => {
  const dropdownContext = useContext(DropdownContext)

  return (
    <Menu.Item
      title={props.title}
      style={{ maxWidth: '100%' }}
      onPress={() => dropdownContext.onChange?.(props.value)}
    >
    </Menu.Item>
  )
}

export default DropdownItem