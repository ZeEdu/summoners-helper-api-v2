import { Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"

import { StyledTextInput } from "@org/ui"
import { TextInputProps } from "react-native-paper"

interface AppControllerProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends UseControllerProps<T, TName> {
  inputOptions: TextInputProps
  style?: StyleProp<ViewStyle>
}

export default function AppInputController<T extends FieldValues>({ name, inputOptions, control }: AppControllerProps<T>) {
  return <Controller
    name={name}
    control={control}
    render={({ field: { onChange, onBlur, value } }) => {
      return (
        <StyledTextInput
          {...inputOptions}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          style={styles.input}
        />
      )
    }}
  />
}

const styles = StyleSheet.create({
  container: {},
  label: {},
  input: {}
})