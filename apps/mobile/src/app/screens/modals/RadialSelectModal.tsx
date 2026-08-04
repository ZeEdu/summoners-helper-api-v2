
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Divider, MD3Theme, Text, useTheme } from 'react-native-paper';

type Props = {
  title: string,
  options: { value: string, label: string }[],
  state: any,
  setState: (React.Dispatch<React.SetStateAction<any>>),
  dismiss: () => void,
  dismissWithValue: () => void,
  multiselect?: boolean,
  okText?: string,
  cancelText?: string
}

export default function RadialSelectModal({ title, options, state, setState, dismiss, dismissWithValue, multiselect = false, okText, cancelText }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const toggleCheckbox = (value: any) => {
    setState((oldValue: any) => {
      if (multiselect) {
        const current = oldValue ?? {};

        if (current[value]) {
          const { [value]: _, ...newValue } = current;
          return newValue;
        }

        const newValue = {
          ...current,
          [value]: true,
        };

        return newValue;
      }

      return value;
    })
  }

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Divider />
      {options.map(({ label, value }) => (
        <Checkbox.Item
          label={label}
          key={value}
          status={multiselect ? state[value] ? 'checked' : 'unchecked' : state === value ? 'checked' : 'unchecked'}
          onPress={() => {
            toggleCheckbox(value)
          }} />
      ))}
      <Divider />
      <View style={styles.actionButtons}>
        <Button onPress={dismiss}>{cancelText ?? 'CANCEL'}</Button>
        <Button onPress={dismissWithValue}>{okText ?? 'OK'}</Button>
      </View>
    </View>
  )
}

const makeStyles = ({ fonts }: MD3Theme) => {
  const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight, fontStyle } = fonts.titleLarge
  return StyleSheet.create({
    title: {
      marginHorizontal: 16,
      marginBottom: 16,
      fontFamily,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      fontStyle
    },
    actionButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8
    }
  })
}