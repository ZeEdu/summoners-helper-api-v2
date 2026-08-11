import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Divider, MD3Theme, Text, useTheme } from 'react-native-paper';

type Props = {
  title: string,
  options: { value: string, label: string, disabled?: boolean }[],
  value: any,
  onChange: (...event: any[]) => void,
  dismiss: () => void,
  multiSelect?: boolean,
  okText?: string,
  cancelText?: string
}

export default function SelectModal({ title, options, value, onChange, dismiss, multiSelect = false, okText }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const computeNewValue = (oldValue: any, toggleValue: any) => {
    if (multiSelect) {
      const current = oldValue ?? {};

      if (current[toggleValue]) {
        const { [toggleValue]: _, ...newValue } = current;
        return newValue;
      }

      const newValue = {
        ...current,
        [toggleValue]: true,
      };

      return newValue;
    }

    return toggleValue;
  }

  const toggleCheckbox = (toggleValue: any) => {
    const newValue = computeNewValue(value, toggleValue)
    onChange(newValue)
  }

  const getCheckboxStatus = (key: any) => {
    const checked = typeof value === 'object'
      ? value?.[key]
      : value === key

    return checked ? 'checked' : 'unchecked'
  }

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Divider />
      <FlatList style={{ maxHeight: 400 }} data={options} renderItem={({ item }) => {
        const { label, value, disabled } = item

        return <Checkbox.Item
          disabled={disabled}
          label={label}
          key={value}
          status={getCheckboxStatus(value)}
          onPress={() => {
            toggleCheckbox(value)
          }}
        />
      }}
      />
      <Divider />
      <View style={styles.actionButtons}>
        <Button onPress={dismiss}>{okText ?? 'OK'}</Button>
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