
import React from 'react';
import { useDropdownContext } from './DropdownContext';

import type { DropdownItemProps as CustomDropdownItemProps } from '../DropdownItem';
import { DropdownItem as CustomDropdownItem } from '../DropdownItem';

export interface Props extends Omit<CustomDropdownItemProps, 'onPress'> {
  value: string
}

const DropdownItem = (props: Props) => {
  const {
    closeMenu,
  } = useDropdownContext();

  return (
    <CustomDropdownItem
      {...props}
      onPress={() => {
        dropdownContext.onChange?.(props.value)
      }}
    ></CustomDropdownItem>
  )
}

export default DropdownItem