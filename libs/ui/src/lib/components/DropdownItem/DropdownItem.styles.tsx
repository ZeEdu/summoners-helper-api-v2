import { StyleSheet } from 'react-native';

import {
  DROPDOWN_ITEM_DENSE_HEIGHT,
  DROPDOWN_ITEM_HEIGHT,
  DROPDOWN_ITEM_HORIZONTAL_PADDING,
  DROPDOWN_ITEM_ICON_SPACING,
  DROPDOWN_ITEM_VERTICAL_PADDING,
} from './DropdownItem.constants';

export const styles = StyleSheet.create({
  container: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',

    minHeight: DROPDOWN_ITEM_HEIGHT,

    paddingHorizontal: DROPDOWN_ITEM_HORIZONTAL_PADDING,
    paddingVertical: DROPDOWN_ITEM_VERTICAL_PADDING,
  },

  dense: {
    minHeight: DROPDOWN_ITEM_DENSE_HEIGHT,
  },

  leading: {
    justifyContent: 'center',
    alignItems: 'center',

    marginRight: DROPDOWN_ITEM_ICON_SPACING,
  },

  content: {
    flex: 1,

    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  trailing: {
    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: DROPDOWN_ITEM_ICON_SPACING,
  },

  title: {
    flexShrink: 1,
  },
});