import { Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form"
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native"

interface AppControllerProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends UseControllerProps<T, TName> {
  label: string,
  placeholder: string,
  style?: StyleProp<ViewStyle>
}

export default function AppController<T extends FieldValues>({ name, label, placeholder, control }: AppControllerProps<T>) {
  return <Controller name={name} control={control} render={({ field: { onChange, onBlur, value } }) => {
    return <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        style={styles.input}
      />
    </View>
  }}></Controller >
}

const styles = StyleSheet.create({
  container: {},
  label: {},
  input: {}
})