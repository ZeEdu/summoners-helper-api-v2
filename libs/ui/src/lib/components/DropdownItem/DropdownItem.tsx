import { View } from 'react-native';

import {
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';


import { useDropdownContext } from '../Dropdown/DropdownContext';
import { styles } from './DropdownItem.styles';
import type { DropdownItemProps } from './DropdownItem.types';

export function DropdownItem({
  title,
  leading,
  trailing,

  dense = false,
  disabled = false,
  closeOnPress = true,

  onPress,

  containerStyle,
  contentStyle,
  titleStyle,

  testID,
}: DropdownItemProps) {
  const theme = useTheme();

  const { closeMenu } = useDropdownContext();

  const handlePress = (event: any) => {
    if (disabled) {
      return;
    }

    onPress?.(event);

    if (closeOnPress) {
      closeMenu();
    }
  };

  return (
    <TouchableRipple
      borderless={false}
      disabled={disabled}
      onPress={handlePress}
      testID={testID}
    >
      <View
        style={[
          styles.container,
          dense && styles.dense,
          disabled && styles.disabled,
          containerStyle,
        ]}
      >
        {leading && (
          <View style={styles.leading}>
            {leading}
          </View>
        )}

        <View
          style={[
            styles.content,
            contentStyle,
          ]}
        >
          {typeof title === 'string'
            ? (
              <Text
                variant="bodyLarge"
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color: disabled
                      ? theme.colors.onSurfaceDisabled
                      : theme.colors.onSurface,
                  },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            )
            : (
              title
            )}
        </View>

        {trailing && (
          <View style={styles.trailing}>
            {trailing}
          </View>
        )}
      </View>
    </TouchableRipple>
  );
}

export default DropdownItem;