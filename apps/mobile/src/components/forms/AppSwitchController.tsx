import { Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { StyleSheet, Switch, View } from "react-native";
import { Text } from "react-native-paper";



interface AppSwitchControllerProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends UseControllerProps<T, TName> {
  label: string,
}

export default function AppSwitchController<T extends FieldValues>({ control, name, label }: AppSwitchControllerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View
          style={styles.container}
        >
          <Text style={styles.text}>
            {label}
          </Text>
          <Switch onValueChange={onChange} onBlur={onBlur} value={value} />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  text: {
    marginLeft: 16
  }
})



